import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { CreateUserRequest } from '../dto/user.dto';
import { hashSync } from 'bcryptjs';

@Injectable()
export class CreateUserInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload: CreateUserRequest) {
    payload.password = hashSync(payload.password, 10);
    return this.userGateway.create(payload);
  }
}
