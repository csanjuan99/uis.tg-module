import { Injectable } from '@nestjs/common';
import { FindAppealByIdInteractor } from './findAppealById.interactor';
import { AppealDocument } from '../../../infrastructure/persistence/schema/appeal.schema';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { UpdateAppealRequest } from '../dto/appeal.dto';

@Injectable()
export class UpdateAppealByIdInteractor {
  constructor(
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
    private readonly appealGateway: AppealGateway,
  ) {}

  async execute(
    id: string,
    payload: UpdateAppealRequest,
  ): Promise<AppealDocument> {
    const subject: AppealDocument =
      await this.findAppealByIdInteractor.execute(id);

    return this.appealGateway.updateById(subject.id, payload);
  }
}
