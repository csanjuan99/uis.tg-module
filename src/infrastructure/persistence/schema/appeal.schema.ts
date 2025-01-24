import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StudentShift, User } from './user.schema';

export type AppealDocument = HydratedDocument<Appeal>;

export enum AppealStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PARTIAL_REJECTED = 'PARTIAL_REJECTED',
  REVIEW = 'REVIEW',
}

export enum AppealRequestStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

@Schema({
  _id: false,
})
export class AppealRequestChange {
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
    type: Boolean,
    required: false,
    default: undefined,
  })
  approved?: boolean;
}

@Schema()
export class AppealRequest {
  @Prop({
    required: false,
    type: AppealRequestChange,
  })
  from?: AppealRequestChange;
  @Prop([AppealRequestChange])
  to?: AppealRequestChange[];
  @Prop({
    required: false,
    type: String,
    default: null,
  })
  reason?: string;
  @Prop({
    required: true,
    enum: [
      AppealRequestStatus.PENDING,
      AppealRequestStatus.APPROVED,
      AppealRequestStatus.REJECTED,
    ],
    default: AppealRequestStatus.PENDING,
  })
  status?: AppealRequestStatus;
}

@Schema()
export class AppealStudent {
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
  })
  username: string;
  @Prop({
    required: true,
  })
  identification: string;
  @Prop(StudentShift)
  shift?: StudentShift;
}

export class AppealLog {}

@Schema({
  collection: 'appeals',
  timestamps: true,
})
export class Appeal {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  student: Partial<User>;
  @Prop([AppealRequest])
  requests: AppealRequest[];
  @Prop({
    required: false,
    default: [],
    type: [AppealLog],
  })
  logs?: AppealLog[];
  @Prop({
    required: false,
    default: null,
  })
  observation?: string;
  @Prop({
    required: true,
    enum: [
      AppealStatus.PENDING,
      AppealStatus.APPROVED,
      AppealStatus.REJECTED,
      AppealStatus.PARTIAL_REJECTED,
      AppealStatus.REVIEW,
    ],
    default: AppealStatus.PENDING,
  })
  status?: string;
  @Prop({
    required: false,
    default: null,
  })
  attendedBy?: string;
}

export const AppealSchema = SchemaFactory.createForClass(Appeal);
