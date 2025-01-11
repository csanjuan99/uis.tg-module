import { Injectable } from '@nestjs/common';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { FilterQuery } from 'mongoose';
import { Appeal } from '../../../infrastructure/persistence/schema/appeal.schema';

@Injectable()
export class CountAppealInteractor {
  constructor(private readonly appealGateway: AppealGateway) {}

  async execute(payload?: FilterQuery<Appeal>) {
    return this.appealGateway.count(payload);
  }
}
