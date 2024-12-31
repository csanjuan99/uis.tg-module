import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { HydratedDocument } from 'mongoose';
import * as stream from 'node:stream';

export type AppealDocument = HydratedDocument<Appeal>;

export enum AppealStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PARTIAL_REJECTED = 'PARTIAL_REJECTED',
}

export enum AppealRequestStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema()
export class AppealRequestChange {
  @Prop({
    required: true,
  })
  group: string;
  @Prop({
    required: true,
  })
  sku: string;
}

export class AppealRequest {
  @Prop(AppealRequestChange)
  from?: AppealRequestChange;
  @Prop(AppealRequestChange)
  to?: AppealRequestChange;
  @Prop({
    required: false,
    type: String,
    default: null,
  })
  reason?: string;
  @Prop({
    required: false,
    enum: AppealRequestStatus,
    default: null,
  })
  status?: AppealRequestStatus;
}

@Schema({
  collection: 'appeals',
  timestamps: true,
})
export class Appeal {
  @Prop({
    type: String,
  })
  studentId: string;
  @Prop({
    required: true,
    type: [AppealRequest],
    default: [],
  })
  requests: AppealRequest[];
  @Prop(raw({}))
  logs?: Record<string, any>[];
  @Prop({
    required: true,
    enum: AppealStatus,
    default: AppealStatus.PENDING,
  })
  status: AppealStatus;
}

export const AppealSchema = SchemaFactory.createForClass(Appeal);
