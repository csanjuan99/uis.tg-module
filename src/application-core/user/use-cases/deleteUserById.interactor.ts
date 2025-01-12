import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FindUserByIdInteractor } from './findUserById.interactor';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class DeleteUserByIdInteractor {
  constructor(
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(id: string) {
    const user: UserDocument = await this.findUserByIdInteractor.execute(id);
    return this.userGateway.deleteById(user.id);
  }
}
