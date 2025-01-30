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

  /**
   * Decide si podemos asignar una "appeal" con el shift del estudiante
   * basado en las reglas:
   *
   * 1) Validar horario (mañana >= 8:00, tarde >= 14:00)
   * 2) Comparar semana actual con "start" para ver si es la misma, anterior o posterior
   * 3) Si es la misma semana -> comparar día. (días anteriores tienen prioridad, día igual validamos AM/PM)
   * 4) Si la semana es mayor -> no asignamos
   * 5) Si la semana es menor -> se asume que es rezagada y se asigna (opcional: se podría seguir validando horario)
   */
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

    // 1) Validar si el sistema está “abierto”
    //    - Mañana: a partir de las 8:00 AM
    //    - Tarde: a partir de las 14:00 PM
    if (
      (currentTime === 'AM' && hour < 8) ||
      (currentTime === 'PM' && hour < 14)
    ) {
      return false;
    }

    // 2) Comparar weeks
    //    - Si la currentWeek > startWeek => “futuro” => no asignar
    //    - Si la currentWeek < startWeek => es rezagado => sí asignar (o puedes aplicar más lógica)
    //    - Si la currentWeek === startWeek => validamos días
    if (currentWeek > startWeek) {
      return false;
    } else if (currentWeek < startWeek) {
      // Es de semanas pasadas => lo asignamos sin más validaciones de día/AM/PM
      return true;
    } else {
      // currentWeek === startWeek
      // 3) Validar día
      const shiftDayIndex = days.indexOf(shift.day);

      if (shiftDayIndex < currentDayIndex) {
        // Día de la solicitud es anterior al día actual -> se asigna
        return true;
      } else if (shiftDayIndex > currentDayIndex) {
        // Día posterior -> no asignar
        return false;
      } else {
        // Mismo día: validamos la jornada
        // "AM solo acepta AM" / "PM puede aceptar PM y AM"
        if (currentTime === 'AM') {
          // Solo SHIFT con time = 'AM'
          return shift.time === 'AM';
        } else {
          // currentTime === 'PM'
          // SHIFT con time = 'AM' o 'PM'
          return true;
        }
      }
    }
  }
}
