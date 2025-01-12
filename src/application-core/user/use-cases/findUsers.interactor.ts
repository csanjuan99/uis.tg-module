import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FilterQuery, ProjectionFields, QueryOptions } from 'mongoose';
import { User } from '../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class FindUsersInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(
    payload?: FilterQuery<User>,
    projection?: ProjectionFields<User>,
    options?: QueryOptions,
  ) {
    return this.userGateway.find(payload, projection, options);
  }
}
