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

    let appeal: AppealDocument = await this.appealGateway.findOne({
      status: AppealStatus.REVIEW,
      attended: user.id,
    });

    if (!appeal) {
      const BATCH_SIZE = 50;
      let skip = 0;

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
          return;
        }

        for (const candidate of candidates) {
          const student = candidate.student as UserDocument;
          if (!student) continue;

          if (this.handleShift(candidate.student.shift)) {
            appeal = candidate;
            break;
          }
        }

        if (appeal) {
          break;
        }

        skip += BATCH_SIZE;
      }
    }

    if (!appeal) {
      return;
    }

    appeal.status = AppealStatus.REVIEW;
    appeal.attended = user;
    await appeal.save();
  }

  private handleShift(shift: StudentShift): boolean {
    const days: string[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const start: number = dayjs(process.env.DAYJS_START).isoWeek();
    const now: Dayjs = dayjs();
    const week: number = now.isoWeek();
    const day: string = now.format('dddd').toUpperCase();
    const time: string = now.format('A').toUpperCase();

    if (now.hour() > 12 && now.hour() < 2) {
      return false;
    }

    if (!shift) {
      return;
    }

    if (week < start) {
      return false;
    }

    if (week > start) {
      return true;
    }

    const index: number = days.indexOf(shift.day);

    if (index < now.isoWeekday()) {
      return true;
    }

    if (day === shift.day) {
      if (time === shift.time) {
        return true;
      }
      if (time === 'PM' && shift.time === 'AM') {
        return true;
      }
      if (time === 'AM' && shift.time === 'PM') {
        return false;
      }
    }

    return false;
  }
}
