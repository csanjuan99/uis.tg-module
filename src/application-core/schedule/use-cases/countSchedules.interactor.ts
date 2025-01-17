import { Injectable } from '@nestjs/common';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import { FilterQuery } from 'mongoose';
import { Schedule } from '../../../infrastructure/persistence/schema/schedule.schema';

@Injectable()
export class CountSchedulesInteractor {
  constructor(private readonly scheduleGateway: ScheduleGateway) {}

  async execute(payload?: FilterQuery<Schedule>): Promise<number> {
    return this.scheduleGateway.count(payload);
  }
}
