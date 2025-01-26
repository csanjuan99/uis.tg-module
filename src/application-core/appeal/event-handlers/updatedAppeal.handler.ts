import { Injectable } from '@nestjs/common';
import {
  AppealDocument,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class UpdatedAppealHandler {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent('appeal.updated')
  async execute({
    appeal,
    user,
  }: {
    appeal: AppealDocument;
    user: UserDocument;
  }) {
    console.log('UpdatedAppealHandler', appeal);
    console.log('UpdatedAppealHandler', user);
    await this.handleStatus(appeal, user);
    this.handleSchedule(appeal);
  }

  private async handleStatus(appeal: AppealDocument, user: UserDocument) {
    // TODO: notificar cuando cambie el estado general de la solicitud
    // usar user para registrar logs
    if (
      appeal.status === AppealStatus.APPROVED ||
      appeal.status === AppealStatus.REJECTED ||
      appeal.status === AppealStatus.PARTIAL_REJECTED
    ) {
      await this.eventEmitter.emitAsync('assign.appeal', user);
    }
  }

  private handleSchedule(appeal: AppealDocument) {
    // TODO: Cambio al horario del estudiante una vez un to sea aprobado
    if (
      appeal.status === AppealStatus.APPROVED ||
      appeal.status === AppealStatus.PARTIAL_REJECTED
    ) {
    }
  }
}
