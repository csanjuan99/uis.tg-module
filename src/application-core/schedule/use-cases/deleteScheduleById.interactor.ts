import { Injectable } from '@nestjs/common';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import { FindScheduleByIdInteractor } from './findScheduleById.interactor';
import { ScheduleDocument } from '../../../infrastructure/persistence/schema/schedule.schema';

@Injectable()
export class DeleteScheduleByIdInteractor {
  constructor(
    private readonly findScheduleByIdInteractor: FindScheduleByIdInteractor,
    private readonly scheduleGateway: ScheduleGateway,
  ) {}

  async execute(id: string): Promise<ScheduleDocument> {
    const schedule: ScheduleDocument =
      await this.findScheduleByIdInteractor.execute(id);
    return await this.scheduleGateway.deleteById(schedule.id);
  }
}
