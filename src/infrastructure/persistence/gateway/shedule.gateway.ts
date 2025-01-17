import { Injectable } from '@nestjs/common';
import { IGateway } from '../../interface/IGateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from '../schema/schedule.schema';

@Injectable()
export class ScheduleGateway extends IGateway<ScheduleDocument, Schedule> {
  constructor(@InjectModel(Schedule.name) model: Model<ScheduleDocument>) {
    super(model);
  }
}
