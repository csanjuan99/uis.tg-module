import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { ProjectionFields } from 'mongoose';
import {
  User,
  UserDocument,
} from '../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class FindUserByIdInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(id: string, projection?: ProjectionFields<User>) {
    const user: UserDocument = await this.userGateway.findById(id, projection);
    if (!user) {
      throw new NotFoundException('No pudimos encontrar el usuario');
    }
    return user;
  }
}
