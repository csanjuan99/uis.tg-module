import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

export class SubjectGroupSchedule {
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

export class SubjectGroup {
  @Prop({
    type: String,
    required: true,
  })
  sku: string;
  @Prop({
    type: Number,
    required: true,
  })
  capacity: number;
  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  enrolled: number;
  @Prop({
    type: [SubjectGroupSchedule],
    required: false,
    default: [],
  })
  schedule: SubjectGroupSchedule[];
}

@Schema({
  collection: 'subjects',
  timestamps: true,
})
export class Subject {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  sku: string;
  @Prop({
    type: String,
    required: true,
  })
  name: string;
  @Prop({
    type: [String],
    required: false,
    default: [],
  })
  requirements: string[];
  @Prop({
    type: Number,
    required: true,
  })
  credits: number;
  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  level: number | string;
  @Prop({
    type: [SubjectGroup],
    required: false,
    default: [],
  })
  groups: SubjectGroup[];
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
