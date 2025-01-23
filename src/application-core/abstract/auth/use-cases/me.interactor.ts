import { Injectable } from '@nestjs/common';
import { FindUserByIdInteractor } from '../../../user/use-cases/findUserById.interactor';

@Injectable()
export class MeInteractor {
  constructor(
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
  ) {}

  async execute(userId: string) {
    return this.findUserByIdInteractor.execute(userId, {
      password: 0,
    });
  }
}
