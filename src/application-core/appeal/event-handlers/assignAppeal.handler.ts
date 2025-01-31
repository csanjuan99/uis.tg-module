import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  StudentShift,
  UserDocument,
} from '../../../infrastructure/persistence/schema/user.schema';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import {
  AppealDocument,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import { Dayjs } from 'dayjs';
import * as process from 'node:process';

@Injectable()
export class AssignAppealHandler implements OnModuleInit {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
  ) {}

  onModuleInit() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(isoWeek);
    dayjs.tz.setDefault('America/Bogota');
  }

  @OnEvent('assign.appeal')
  async execute(user: UserDocument) {
    if (user.kind !== 'ADMIN') {
      return;
    }

    const appeal: AppealDocument = await this.appealGateway.findOne({
      status: AppealStatus.REVIEW,
      attended: user.id,
    });

    if (appeal) {
      return;
    }

    const BATCH_SIZE = 50;
    let skip = 0;
    let foundAppeal: AppealDocument | null = null;

    while (true) {
      const candidates: AppealDocument[] = await this.appealGateway.find(
        { status: AppealStatus.PENDING },
        null,
        {
          skip,
          limit: BATCH_SIZE,
          sort: {
            createdAt: 1,
          },
          populate: {
            path: 'student',
            select: 'shift',
          },
        },
      );

      if (!candidates.length) {
        break;
      }

      for (const candidate of candidates) {
        const student = candidate.student as UserDocument;
        if (!student || !student.shift) {
          continue;
        }

        if (this.canAssign(student.shift)) {
          foundAppeal = candidate;
          break;
        }
      }

      if (foundAppeal) {
        break;
      }

      skip += BATCH_SIZE;
    }

    if (!foundAppeal) {
      return;
    }

    foundAppeal.status = AppealStatus.REVIEW;
    foundAppeal.attended = user;
    await foundAppeal.save();
  }

  private canAssign(shift: StudentShift): boolean {
    const days: string[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];

    const startWeek: number = dayjs(process.env.DAYJS_START).isoWeek();

    const now: Dayjs = dayjs();
    const currentWeek: number = now.isoWeek();
    const currentDayIndex: number = now.isoWeekday();
    const currentTime: string = now.format('A').toUpperCase();
    const hour: number = now.hour();

    if (hour < 8) {
      return false;
    }

    if (currentWeek > startWeek) {
      return false;
    } else if (currentWeek < startWeek) {
      return true;
    } else {
      const shiftDayIndex = days.indexOf(shift.day);

      if (shiftDayIndex < currentDayIndex) {
        return true;
      } else if (shiftDayIndex > currentDayIndex) {
        return false;
      } else {
        if (currentTime === 'AM') {
          return shift.time === 'AM';
        } else {
          return true;
        }
      }
    }
  }
}
