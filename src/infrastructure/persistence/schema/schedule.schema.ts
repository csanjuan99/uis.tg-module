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
  @Prop([ScheduleSubject])
  subjects: ScheduleSubject[];
  @Prop({
    required: true,
    unique: true,
  })
  studentId: string;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
