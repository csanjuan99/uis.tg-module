import { Injectable } from '@nestjs/common';
import { AppealDocument } from '../../../infrastructure/persistence/schema/appeal.schema';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UpdatedAppealHandler {
  constructor() {}

  @OnEvent('appeal.updated')
  async execute(appeal: AppealDocument) {
    console.log('UpdatedAppealHandler', appeal);
  }

  private handleStatus() {
    // TODO: notificar cuando cambie el estado general de la solicitud
  }

  private handleSchedule() {
    // TODO: Cambio al horario del estudiante una vez un to sea aprobado
  }
}
