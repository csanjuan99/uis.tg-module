import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

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
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({
    required: false,
  })
  identification?: string;
  @Prop({ required: true })
  kind: 'STUDENT' | 'ADMIN' | 'ROOT';
  @Prop({ required: true })
  password: string;
  @Prop({ required: false, default: false })
  verified?: boolean;
  @Prop({ required: true })
  permissions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  { identification: 1 },
  {
    unique: true,
    partialFilterExpression: { identification: { $exists: true, $ne: null } },
  },
);
