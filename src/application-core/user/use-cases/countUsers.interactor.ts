import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FilterQuery } from 'mongoose';
import { User } from '../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class CountUsersInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload?: FilterQuery<User>) {
    return this.userGateway.count(payload);
  }
}
