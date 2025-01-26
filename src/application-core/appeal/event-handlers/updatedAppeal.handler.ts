import { Injectable } from '@nestjs/common';
import {
  AppealDocument,
  AppealRequest,
  AppealRequestChange,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { request } from 'express';
import { ScheduleDocument } from '../../../infrastructure/persistence/schema/schedule.schema';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import {
  SubjectDocument,
  SubjectGroup,
} from '../../../infrastructure/persistence/schema/subject.schema';

@Injectable()
export class UpdatedAppealHandler {
  constructor(
    private readonly scheduleGateway: ScheduleGateway,
    private readonly subjectGateway: SubjectGateway,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('appeal.updated')
  async execute({
    appeal,
    user,
  }: {
    appeal: AppealDocument;
    user: UserDocument;
  }) {
    await this.handleStatus(appeal, user);
    await this.handleSchedule(appeal);
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

  private async handleSchedule(appeal: AppealDocument) {
    if (
      appeal.status === AppealStatus.APPROVED ||
      appeal.status === AppealStatus.PARTIAL_REJECTED
    ) {
      const schedule: ScheduleDocument = await this.scheduleGateway.findOne({
        student: appeal.student,
      });

      if (!schedule) {
        return;
      }

      for (const request of appeal.requests) {
        if (request.from === null && request.to.length) {
          const to: AppealRequestChange = request.to.find(
            (to) => to.approved === true,
          );

          if (!to) {
            continue;
          }

          const subject: SubjectDocument = await this.subjectGateway.findOne({
            sku: to.sku,
          });

          if (!subject) {
            continue;
          }

          const group: SubjectGroup = subject.groups.find(
            (group) => group.sku === to.group,
          );

          schedule.subjects.push({
            name: subject.name,
            sku: subject.sku,
            group: {
              sku: group.sku,
              schedule: group.schedule,
            },
          });

          await schedule.save();
        } else if (request.to === null && request.from !== null) {
          schedule.subjects = schedule.subjects.filter(
            (subject) => subject.sku !== request.from.sku,
          );
          await schedule.save();
        } else if (request.from !== null && request.to.length) {
          schedule.subjects = schedule.subjects.filter(
            (subject) => subject.sku !== request.from.sku,
          );

          const to: AppealRequestChange = request.to.find(
            (to) => to.approved === true,
          );

          if (!to) {
            continue;
          }

          const subject: SubjectDocument = await this.subjectGateway.findOne({
            sku: to.sku,
          });

          if (!subject) {
            continue;
          }

          const group: SubjectGroup = subject.groups.find(
            (group) => group.sku === to.group,
          );

          schedule.subjects.push({
            name: subject.name,
            sku: subject.sku,
            group: {
              sku: group.sku,
              schedule: group.schedule,
            },
          });

          await schedule.save();
        }
      }
    }
  }
}
