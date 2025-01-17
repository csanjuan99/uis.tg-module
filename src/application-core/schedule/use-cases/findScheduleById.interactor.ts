import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import { ProjectionFields } from 'mongoose';
import {
  Schedule,
  ScheduleDocument,
} from '../../../infrastructure/persistence/schema/schedule.schema';

@Injectable()
export class FindScheduleByIdInteractor {
  constructor(private readonly scheduleGateway: ScheduleGateway) {}

  async execute(
    id: string,
    projection?: ProjectionFields<Schedule>,
  ): Promise<ScheduleDocument> {
    const schedule: ScheduleDocument = await this.scheduleGateway.findById(
      id,
      projection,
    );

    if (!schedule) {
      throw new NotFoundException('No pudimos encontrar este horario');
    }

    return schedule;
  }
}
