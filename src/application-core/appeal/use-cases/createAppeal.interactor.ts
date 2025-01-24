import { Injectable, NotFoundException } from '@nestjs/common';
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

    const _appeal: AppealDocument = await this.appealGateway.findOne({
      student: student.id,
      status: AppealStatus.PENDING,
    });

    if (_appeal) {
      throw new NotFoundException('Ya existe una solicitud pendiente');
    }

    const appeal: AppealDocument = await this.appealGateway.create({
      requests: payload.requests,
      student,
    });

    return appeal;
  }
}
