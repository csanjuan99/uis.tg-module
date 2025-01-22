import { Injectable } from '@nestjs/common';
import { FindAppealByIdInteractor } from './findAppealById.interactor';
import { AppealDocument } from '../../../infrastructure/persistence/schema/appeal.schema';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { UpdateAppealRequest } from '../dto/appeal.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UpdateAppealByIdInteractor {
  constructor(
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
    private readonly appealGateway: AppealGateway,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    payload: UpdateAppealRequest,
  ): Promise<AppealDocument> {
    const subject: AppealDocument =
      await this.findAppealByIdInteractor.execute(id);

    const appeal: AppealDocument = await this.appealGateway.updateById(
      subject.id,
      payload,
    );

    this.eventEmitter.emit('appeal.updated', appeal);

    return appeal;
  }
}
