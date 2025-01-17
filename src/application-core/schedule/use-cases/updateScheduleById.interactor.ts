import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import {
  Schedule,
  ScheduleDocument,
} from '../../../infrastructure/persistence/schema/schedule.schema';
import { FindScheduleByIdInteractor } from './findScheduleById.interactor';

@Injectable()
export class UpdateScheduleByIdInteractor {
  constructor(
    private readonly findScheduleByIdInteractor: FindScheduleByIdInteractor,
    private readonly scheduleGateway: ScheduleGateway,
  ) {}

  async execute(
    id: string,
    payload: Partial<Schedule>,
  ): Promise<ScheduleDocument> {
    const schedule: ScheduleDocument =
      await this.findScheduleByIdInteractor.execute(id);
    return await this.scheduleGateway.updateById(schedule.id, payload);
  }
}
