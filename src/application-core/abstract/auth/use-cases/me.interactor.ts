import { Injectable } from '@nestjs/common';
import { FindUserByIdInteractor } from '../../../user/use-cases/findUserById.interactor';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class MeInteractor {
  constructor(
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
  ) {}

  async execute(userId: string) {
    const user: UserDocument = await this.findUserByIdInteractor.execute(
      userId,
      {
        password: 0,
      },
    );

    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      identification: user.identification ? user.identification : undefined,
      username: user.username,
      permissions: user.permissions,
      kind: user.kind,
      shift: user.shift ? user.shift : undefined,
    };
  }
}
