/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  _id: false,
  timestamps: false,
})
export class StudentShift {
  @Prop({
    required: true,
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
  })
  day: string;
  @Prop({
    required: true,
    enum: ['AM', 'PM'],
  })
  time: string;
}

@Schema({
  _id: false,
  timestamps: false,
})
export class StudentProgram {
  @Prop({
    required: true,
    enum: [11, 27, 69, 50, 21, 14, 58, 32, 14],
  })
  id: number;
  @Prop({
    required: false,
    enum: [
      'INGENIERIA DE SISTEMAS',
      'DISEÑO INDUSTRIAL',
      'INGENIERIA BIOMEDICA',
      'INGENIERIA EN CIENCIA DE DATOS',
      'INGENIERIA CIVIL',
      'QUIMICA',
      'MICROBIOLOGIA',
      'INGENIERIA DE PETROLEOS',
      'INGENIERIA MECANICA',
      'INGENIERIA INDUSTRIAL',
      'INGENIERIA QUIMICA',
      'NUTRICION',
      'INGENIERIA EN INTELIGENCIA ARTIFICIAL',
    ],
  })
  name?: string;
  @Prop({
    required: false,
    default: null,
  })
  new_pensum?: boolean;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    required: true,
  })
  lastname: string;
  @Prop({
    required: true,
    unique: true,
  })
  username: string;
  @Prop({
    required: false,
    default: null,
  })
  identification?: string;
  @Prop(StudentShift)
  shift?: StudentShift;
  @Prop({
    required: true,
  })
  kind: 'STUDENT' | 'ADMIN' | 'ROOT';
  @Prop({
    required: true,
  })
  password: string;
  @Prop({
    required: false,
    default: false,
  })
  verified?: boolean;
  @Prop({
    required: true,
  })
  permissions: string[];
  @Prop({
    required: false,
  })
  program?: StudentProgram;
  @Prop({
    required: false,
  })
  level?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  { identification: 1 },
  {
    unique: true,
    partialFilterExpression: { identification: { $exists: true, $ne: null } },
  },
);
UserSchema.index({ shift: 1 });
