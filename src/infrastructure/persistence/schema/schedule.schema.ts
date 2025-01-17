import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema()
export class ScheduleSubject {
  @Prop({
    required: true,
  })
  group: string;
  @Prop({
    required: true,
  })
  sku: string;
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    type: String,
    required: true,
  })
  day: string;
  @Prop({
    type: String,
    required: true,
  })
  time: string;
  @Prop({
    type: String,
    required: true,
  })
  building: string;
  @Prop({
    type: String,
    required: true,
  })
  room: string;
  @Prop({
    type: String,
    required: true,
  })
  professor: string;
}

@Schema({
  collection: 'schedule',
  timestamps: true,
})
export class Schedule {
  @Prop({
    required: false,
    default: [],
    type: [ScheduleSubject],
  })
  monday: ScheduleSubject[];
  @Prop({
    required: false,
    default: [],
    type: [ScheduleSubject],
  })
  tuesday: ScheduleSubject[];
  @Prop({
    required: false,
    default: [],
    type: [ScheduleSubject],
  })
  wednesday: ScheduleSubject[];
  @Prop({
    required: false,
    default: [],
    type: [ScheduleSubject],
  })
  thursday: ScheduleSubject[];
  @Prop({
    required: false,
    default: [],
    type: [ScheduleSubject],
  })
  friday: ScheduleSubject[];
  @Prop({
    required: false,
    default: [],
    type: [ScheduleSubject],
  })
  saturday: ScheduleSubject[];
  @Prop({
    required: true,
    unique: true,
  })
  studentId: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
