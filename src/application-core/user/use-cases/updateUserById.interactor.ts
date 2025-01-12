import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { UpdateUserRequest } from '../dto/user.dto';
import { FindUserByIdInteractor } from './findUserById.interactor';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UpdateUserByIdInteractor {
  constructor(
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(id: string, payload: UpdateUserRequest) {
    const user: UserDocument = await this.findUserByIdInteractor.execute(id);
    if (payload.password) {
      payload.password = hashSync(payload.password, 10);
    }
    return this.userGateway.updateById(user.id, payload);
  }
}
