import { Injectable } from '@nestjs/common';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { FilterQuery, ProjectionFields, QueryOptions } from 'mongoose';
import { Appeal } from '../../../infrastructure/persistence/schema/appeal.schema';

@Injectable()
export class FindAppealsInteractor {
  constructor(private readonly appealGateway: AppealGateway) {}

  async execute(
    filter: FilterQuery<Appeal>,
    projection?: ProjectionFields<Appeal>,
    options?: QueryOptions,
  ) {
    return this.appealGateway.find(filter, projection, options);
  }
}
