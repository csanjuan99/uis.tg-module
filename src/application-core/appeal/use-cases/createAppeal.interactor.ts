/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { CreateAppealRequest } from '../dto/appeal.dto';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import {
  AppealDocument,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { FindUserByIdInteractor } from '../../user/use-cases/findUserById.interactor';

@Injectable()
export class CreateAppealInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly configService: ConfigService,
  ) {}

  async execute(payload: CreateAppealRequest) {
    const student: UserDocument = await this.findUserByIdInteractor.execute(
      payload.student['id'],
    );

    if (student.kind !== 'STUDENT') {
      throw new NotFoundException('No pudimos encontrar a este estudiante');
    }

    if (!student.shift) {
      throw new NotFoundException('El estudiante no tiene un turno asignado');
    }

    // Validación creación de solicitudes para programas con ID 69 o 50 (biomédica y ciencia de datos)
    if (student.program?.id === 69 || student.program?.id === 50) {
      const specialStartDate = this.configService.get<string>('DAYJS_START_EXTRA');
      const specialEndDate = this.configService.get<string>('DAYJS_END_EXTRA');
      const currentDate = dayjs();

      if (currentDate.isBefore(specialStartDate) || currentDate.isAfter(specialEndDate)) {
        throw new BadRequestException(
          `Para el programa ${student.program.name}, la fecha de creación de la solicitud debe estar entre ${dayjs(specialStartDate).format('YYYY-MM-DD')} y ${dayjs(specialEndDate).format('YYYY-MM-DD')}`,
        );
      }
    } else {
      // Validación general para los demas programas
      const startDateStr = this.configService.get<string>('DAYJS_START');
      const endDateStr = this.configService.get<string>('DAYJS_END');

      if (!startDateStr || !endDateStr) {
        throw new BadRequestException('Las fechas de inicio y fin del período no están configuradas');
      }

      const startDate = dayjs(startDateStr).startOf('day');
      const endDate = dayjs(endDateStr).endOf('day');
      const currentDate = dayjs();

      if (currentDate.isBefore(startDate) || currentDate.isAfter(endDate)) {
        throw new BadRequestException(
          `La fecha de creación de la solicitud está fuera del período permitido (${startDate.format('YYYY-MM-DD')} - ${endDate.format('YYYY-MM-DD')})`,
        );
      }
    }

    // Obtener el período académico automáticamente de las variables de entorno
    const period = {
      year: parseInt(this.configService.get<string>('ACADEMIC_YEAR', '2025')),
      term: parseInt(this.configService.get<string>('ACADEMIC_TERM', '1')),
    };

    // Buscar apelaciones pendientes para el mismo estudiante y período académico
    const _appeal: AppealDocument = await this.appealGateway.findOne({
      student: student.id,
      status: AppealStatus.PENDING,
      'period.year': period.year,
      'period.term': period.term,
    });

    if (_appeal) {
      throw new NotFoundException('Ya existe una solicitud pendiente para este período académico');
    }

    const appeal: AppealDocument = await this.appealGateway.create({
      requests: payload.requests,
      ask: payload.ask,
      logs: [],
      student,
      period: { year: period.year, term: period.term },
    });

    appeal.logs.push({
      user: {
        id: student.id,
        name: student.name,
        lastname: student.lastname,
        identification: student.identification,
      },
    });

    await appeal.save();

    return appeal;
  }
}