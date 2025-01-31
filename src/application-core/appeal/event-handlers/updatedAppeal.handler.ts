import { Injectable, NotFoundException } from '@nestjs/common';
import {
  AppealDocument,
  AppealRequestChange,
  AppealRequestStatus,
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
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';

handlebars.registerHelper('eq', (a, b) => a === b);

@Injectable()
export class UpdatedAppealHandler {
  constructor(
    private readonly sendEmailByMailtrapInteractor: SendEmailByMailtrapInteractor,
    private readonly userGateway: UserGateway,
    private readonly scheduleGateway: ScheduleGateway,
    private readonly subjectGateway: SubjectGateway,
    private readonly appealGateway: AppealGateway,
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

      await appeal.save();
    }
  }

  private async handleSchedule(appeal: AppealDocument) {
    // Solo se aplica lógica si está en estado que permita cambios (APROBADA o PARCIALMENTE RECHAZADA).
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

      // Recorremos cada request en orden.
      for (const request of appeal.requests) {
        // 1. Verificamos si la petición está aprobada en su conjunto.
        //    (Cada petición en 'requests' tiene su propio status: PENDING, APPROVED, REJECTED)
        if (request.status !== AppealRequestStatus.APPROVED) {
          // Si la petición no está aprobada, no la procesamos
          continue;
        }

        // 2. Lógica de cancelación de materia (request.from)
        //    - Ocurre cuando "from" existe y "to" es null o array vacío
        //    - O bien cuando "from" existe y "to" también existe, pero necesitamos primero "liberar" esa materia
        if (
          request.from !== null &&
          request.from !== undefined &&
          (request.to === null || request.to.length === 0)
        ) {
          // Este bloque es solo si la petición es "eliminar" la materia (sin añadir otra)
          // Eliminamos la materia de schedule (si aún está allí)
          schedule.subjects = schedule.subjects.filter(
            (subject) => subject.sku !== request.from.sku,
          );
          await schedule.save();
          continue;
        }

        // 3. Lógica de inclusión de materia (request.to)
        //    - Ocurre cuando "to" no es null e incluye al menos una materia aprobada.
        //      “Aprobada” quiere decir que en request.to[].approved sea true
        //    - Puede ser un caso donde 'from' es null (solo añadir) o sea != null (sustitución).
        if (request.to !== null && request.to.length > 0) {
          // Si 'from' no es null y se quiere “migrar” de la materia 'from' hacia una de las 'to'
          // primero filtramos la materia 'from' (solo si estaba en schedule).
          if (request.from) {
            // Eliminamos la materia 'from' del schedule
            schedule.subjects = schedule.subjects.filter(
              (subject) => subject.sku !== request.from.sku,
            );
            await schedule.save();
          }

          // Ahora buscamos una 'to' aprobada
          const toApproved: AppealRequestChange = request.to.find(
            (toItem) => toItem.approved === true,
          );

          // Si no hay ninguna 'to' aprobada, no hacemos nada más en esta petición.
          if (!toApproved) {
            continue;
          }

          // Verificamos que la materia a la que se va a migrar exista
          const subject: SubjectDocument = await this.subjectGateway.findOne({
            sku: toApproved.sku,
          });
          if (!subject) {
            continue;
          }

          // Buscamos el grupo específico
          const group: SubjectGroup = subject.groups.find(
            (g) => g.sku === toApproved.group,
          );
          if (!group) {
            continue;
          }

          // Insertamos la nueva materia en el schedule
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
