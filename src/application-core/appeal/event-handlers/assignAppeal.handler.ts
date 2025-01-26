import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
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
import { FindUserByIdInteractor } from '../../user/use-cases/findUserById.interactor';

@Injectable()
export class AssignAppealHandler implements OnModuleInit {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
  ) {}

  onModuleInit() {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(isoWeek);
    dayjs.tz.setDefault('America/Bogota');
  }

  @OnEvent('assign.appeal')
  async execute(user: UserDocument, skip: number = 0) {
    if (user.kind === 'ROOT') {
      return;
    }

    let appeal: AppealDocument;

    appeal = await this.appealGateway.findOne({
      status: AppealStatus.REVIEW,
      attended: user.id,
    });

    if (!appeal) {
      appeal = await this.appealGateway.findOne(
        {
          status: AppealStatus.PENDING,
        },
        null,
        {
          skip,
          sort: {
            createdAt: 1,
          },
          populate: {
            path: 'student',
            select: 'shift',
          },
        },
      );
    }

    if (!appeal) {
      return;
    }

    const student: UserDocument = await this.findUserByIdInteractor.execute(
      appeal.student['_id'],
    );

    if (!student) {
      return;
    }

    const shift: boolean = this.handleShift(student);

    if (!shift) {
      await this.execute(user, skip + 1);
    } else {
      appeal.status = 'REVIEW';
      appeal.attended = user;
      await appeal.save();
    }
  }

  private handleShift(student: UserDocument) {
    const days: string[] = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const today: Dayjs = dayjs();
    const day: string = today.format('dddd').toUpperCase();
    const time: string = today.format('A').toUpperCase();

    const index: number = days.indexOf(student.shift.day);

    if (index < today.isoWeekday()) {
      return true;
    }

    if (day === student.shift.day) {
      if (time === student.shift.time) {
        return true;
      }
      if (time === 'PM' && student.shift.time === 'AM') {
        return true;
      }
      if (time === 'AM' && student.shift.time === 'PM') {
        return false;
      }
    }

    return false;
  }
}
