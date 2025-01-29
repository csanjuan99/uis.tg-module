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
import * as process from 'node:process';

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
  async execute(user: UserDocument) {
    if (user.kind !== 'ADMIN') {
      return;
    }

    // 1) Verificar primero si ya hay un appeal en REVIEW por este user
    let appeal: AppealDocument = await this.appealGateway.findOne({
      status: AppealStatus.REVIEW,
      attended: user.id,
    });

    console.log('APPEAL', appeal);

    // 2) Si no hay, buscamos en PENDING
    let skip = 0;
    while (!appeal) {
      const candidate: AppealDocument = await this.appealGateway.findOne(
        { status: AppealStatus.PENDING },
        null,
        {
          skip,
          sort: { createdAt: 1 },
          populate: {
            path: 'student',
            select: 'shift',
          },
        },
      );

      // Si no hay ninguno más, terminamos
      if (!candidate) {
        return;
      }

      // Verificamos SHIFT
      const student: UserDocument = await this.findUserByIdInteractor.execute(
        candidate.student['_id'],
      );
      if (!student) {
        skip++;
        continue;
      }

      if (this.handleShift(student)) {
        appeal = candidate;
      } else {
        // si no cumple SHIFT, incrementamos skip y seguimos
        skip++;
      }
    }

    // Cuando sales del while, `appeal` debe ser el primer appeal válido
    appeal.status = AppealStatus.REVIEW;
    appeal.attended = user;
    await appeal.save();
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
    const start: number = dayjs(process.env.DAYJS_START).isoWeek();
    const now: Dayjs = dayjs();
    const week: number = now.isoWeek();
    const day: string = now.format('dddd').toUpperCase();
    const time: string = now.format('A').toUpperCase();

    if (
      !(now.hour() >= 8 && now.hour() < 12) &&
      !(now.hour() >= 14 && now.hour() < 18)
    ) {
      return false;
    }

    if (!student.shift) {
      return;
    }

    if (week < start) {
      return false;
    }

    if (week > start) {
      return true;
    }

    const index: number = days.indexOf(student.shift.day);

    if (index < now.isoWeekday()) {
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
