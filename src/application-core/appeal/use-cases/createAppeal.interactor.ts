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
    const user: UserDocument = await this.userGateway.findOne({
      username: payload.user.username,
    });

    if (!user) {
      throw new NotFoundException('No pudimos encontrar a este estudiante');
    }

    if (user.kind !== 'STUDENT') {
      throw new NotFoundException('No pudimos encontrar a este estudiante');
    }

    if (!user.verified) {
      throw new NotFoundException('Este estudiante no ha sido verificado');
    }

    const _appeal: AppealDocument = await this.appealGateway.findOne({
      'student.username': user.username,
      status: AppealStatus.PENDING,
    });

    if (_appeal) {
      throw new NotFoundException('Ya existe una solicitud pendiente');
    }

    const appeal: AppealDocument = await this.appealGateway.create({
      requests: payload.requests,
      status: AppealStatus.PENDING,
      student: {
        username: user.username,
        identification: user.identification,
        name: user.name,
        lastname: user.lastname,
      },
    });

    return appeal;
  }
}
