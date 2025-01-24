import { Injectable, NotFoundException } from '@nestjs/common';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { CreateAppealRequest } from '../dto/appeal.dto';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import {
  AppealDocument,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';

@Injectable()
export class CreateAppealInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
  ) {}

  async execute(payload: CreateAppealRequest) {
    const student: UserDocument = await this.userGateway.findOne({
      username: payload.student.username,
    });

    if (!student) {
      throw new NotFoundException('No pudimos encontrar a este estudiante');
    }

    if (student.kind !== 'STUDENT') {
      throw new NotFoundException('No pudimos encontrar a este estudiante');
    }

    if (!student.shift) {
      throw new NotFoundException('El estudiante no tiene un turno asignado');
    }

    const _appeal: AppealDocument = await this.appealGateway.findOne({
      'student.username': student.username,
      status: AppealStatus.PENDING,
    });

    if (_appeal) {
      throw new NotFoundException('Ya existe una solicitud pendiente');
    }

    const appeal: AppealDocument = await this.appealGateway.create({
      requests: payload.requests,
      status: AppealStatus.PENDING,
      student: {
        username: student.username,
        identification: student.identification,
        name: student.name,
        lastname: student.lastname,
      },
    });

    return appeal;
  }
}
