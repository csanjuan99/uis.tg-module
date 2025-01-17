import { Injectable } from '@nestjs/common';
import { ScheduleGateway } from '../../../infrastructure/persistence/gateway/shedule.gateway';
import { FilterQuery, ProjectionFields, QueryOptions } from 'mongoose';
import {
  Schedule,
  ScheduleDocument,
} from '../../../infrastructure/persistence/schema/schedule.schema';

@Injectable()
export class FindScheduleInteractor {
  constructor(private readonly scheduleGateway: ScheduleGateway) {}

  async execute(
    payload: FilterQuery<Schedule>,
    projection?: ProjectionFields<Schedule>,
    options?: QueryOptions,
  ): Promise<ScheduleDocument[]> {
    return this.scheduleGateway.find(payload, projection, options);
  }
}
