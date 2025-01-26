import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AppealDocument,
  AppealRequestChange,
  AppealStatus,
} from '../../../infrastructure/persistence/schema/appeal.schema';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { ScheduleDocument } from '../../../infrastructure/persistence/schema/schedule.schema';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import {
  SubjectDocument,
  SubjectGroup,
} from '../../../infrastructure/persistence/schema/subject.schema';
import { SendEmailByMailtrapInteractor } from '../../abstract/mailtrap/use-cases/sendEmailByMailtrap.interactor';
import * as path from 'node:path';
import * as fs from 'node:fs';
import handlebars from 'handlebars';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';

handlebars.registerHelper('eq', (a, b) => a === b);

@Injectable()
export class UpdatedAppealHandler {
  constructor(
    private readonly sendEmailByMailtrapInteractor: SendEmailByMailtrapInteractor,
    private readonly userGateway: UserGateway,
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
    if (
      appeal.status === AppealStatus.APPROVED ||
      appeal.status === AppealStatus.REJECTED ||
      appeal.status === AppealStatus.PARTIAL_REJECTED
    ) {
      const student: UserDocument = await this.userGateway.findOne({
        _id: appeal.student,
      });

      if (!student) {
        return;
      }

      const templatePath: string = path.join(
        process.cwd(),
        'dist',
        'templates',
        'updated-appeal.template.hbs',
      );

      if (!fs.existsSync(templatePath)) {
        throw new NotFoundException('No se encontró la plantilla de email');
      }

      const templateContent: string = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);

      const html: string = template({
        status: appeal.status,
        name: student.name,
      });

      await this.sendEmailByMailtrapInteractor.execute(
        [
          {
            email: student.username.toLowerCase(),
          },
        ],
        'Tu solicitud ha sido actualizada',
        'Tu solicitud ha sido actualizada',
        html,
      );

      if (appeal.status === AppealStatus.APPROVED) {
        appeal.logs.push({
          message: 'Solicitud aprobada',
          user: {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
          },
        });
      } else if (appeal.status === AppealStatus.REJECTED) {
        appeal.logs.push({
          message: 'Solicitud rechazada',
          user: {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
          },
        });
      } else if (appeal.status === AppealStatus.PARTIAL_REJECTED) {
        appeal.logs.push({
          message: 'Solicitud parcialmente rechazada',
          user: {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
          },
        });
      }

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
