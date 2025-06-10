/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

    // Obtener el período académico automáticamente de las variables de entorno
    const academicPeriod = {
      year: parseInt(this.configService.get<string>('ACADEMIC_YEAR', '2025')),
      term: parseInt(this.configService.get<string>('ACADEMIC_TERM', '1')),
    };

    // Buscar apelaciones pendientes para el mismo estudiante y período académico
    const _appeal: AppealDocument = await this.appealGateway.findOne({
      student: student.id,
      status: AppealStatus.PENDING,
      'academicPeriod.year': academicPeriod.year,
      'academicPeriod.term': academicPeriod.term,
    });

    if (_appeal) {
      throw new NotFoundException('Ya existe una solicitud pendiente para este período académico');
    }

    const appeal: AppealDocument = await this.appealGateway.create({
      requests: payload.requests,
      ask: payload.ask,
      logs: [],
      student,
    });

    appeal.logs.push({
      period: { year: academicPeriod.year, term: academicPeriod.term },
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
