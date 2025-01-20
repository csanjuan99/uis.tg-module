import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SubjectGroupSchedule } from './subject.schema';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({
  _id: false,
})
export class ScheduleSubjectGroup {
  @Prop({
    required: true,
  })
  sku: string;
  @Prop({
    required: true,
  })
  schedule: SubjectGroupSchedule[];
}

@Schema({
  _id: false,
})
export class ScheduleSubject {
  @Prop({
    required: true,
    type: String,
  })
  _id: string;
  @Prop({
    required: true,
  })
  group: ScheduleSubjectGroup;
  @Prop({
    required: true,
  })
  sku: string;
  @Prop({
    required: true,
  })
  name: string;
}

@Schema({
  collection: 'schedule',
  timestamps: true,
})
export class Schedule {
  @Prop([ScheduleSubject])
  subjects: ScheduleSubject[];
  @Prop({
    required: true,
    unique: true,
  })
  studentId: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
