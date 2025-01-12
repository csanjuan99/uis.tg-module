import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  PENDING = 'PENDING',
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
  @Prop({
    required: true,
  })
  name: string;
}

@Schema()
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

@Schema({
  collection: 'appeals',
  timestamps: true,
})
export class Appeal {
  @Prop({
    type: String,
  })
  studentId: string;
  @Prop([AppealRequest])
  requests: AppealRequest[];
  @Prop(raw({}))
  logs?: Record<string, any>[];
  @Prop({
    required: true,
    enum: [
      AppealStatus.PENDING,
      AppealStatus.APPROVED,
      AppealStatus.REJECTED,
      AppealStatus.PARTIAL_REJECTED,
    ],
    default: AppealStatus.PENDING,
  })
  status: AppealStatus;
}

export const AppealSchema = SchemaFactory.createForClass(Appeal);
