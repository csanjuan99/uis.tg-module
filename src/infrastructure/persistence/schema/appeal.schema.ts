import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

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

@Schema({
  _id: false,
})
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

export class AppealLog {}

@Schema({
  collection: 'appeals',
  timestamps: true,
})
export class Appeal {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  student: Partial<User>;
  @Prop([AppealRequest])
  requests: AppealRequest[];
  @Prop({
    required: true,
    type: [AppealLog],
  })
  logs: AppealLog[];
  @Prop({
    required: false,
    type: String,
    default: null,
  })
  ask?: string;
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
    index: true,
  })
  status?: string;
  @Prop({
    required: false,
    default: undefined,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  attended?: Partial<User>;
}

export const AppealSchema = SchemaFactory.createForClass(Appeal);
AppealSchema.index({ createdAt: 1 });
AppealSchema.index({ status: 1, attended: 1 });
AppealSchema.index({ status: 1, student: 1 });
