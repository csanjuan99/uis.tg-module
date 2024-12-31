import { Injectable } from '@nestjs/common';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { FindAppealByIdInteractor } from './findAppealById.interactor';
import { AppealDocument } from '../../../infrastructure/persistence/schema/appeal.schema';

@Injectable()
export class DeleteAppealByIdInteractor {
  constructor(
    private readonly appealGateway: AppealGateway,
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
  ) {}

  async execute(id: string) {
    const subject: AppealDocument =
      await this.findAppealByIdInteractor.execute(id);
    return this.appealGateway.deleteById(subject.id);
  }
}
