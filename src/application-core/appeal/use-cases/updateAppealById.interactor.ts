import { Injectable } from '@nestjs/common';
import { FindAppealByIdInteractor } from './findAppealById.interactor';
import { AppealDocument } from '../../../infrastructure/persistence/schema/appeal.schema';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { UpdateAppealRequest } from '../dto/appeal.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { FindUserByIdInteractor } from '../../user/use-cases/findUserById.interactor';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';

@Injectable()
export class UpdateAppealByIdInteractor {
  constructor(
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    id: string,
    payload: UpdateAppealRequest,
  ): Promise<AppealDocument> {
    const _appeal: AppealDocument = await this.findAppealByIdInteractor.execute(
      id,
      null,
      {
        populate: {
          path: 'attended',
        },
      },
    );

    const appeal: AppealDocument = await this.appealGateway.updateById(
      _appeal.id,
      payload,
    );

    let user: UserDocument;
    if (appeal.attended) {
      user = await this.findUserByIdInteractor.execute(appeal.attended['_id']);
    } else {
      user = await this.userGateway.findOne({
        kind: 'ROOT',
      });
      appeal.attended = user.id;
      await appeal.save();
    }

    this.eventEmitter.emit('appeal.updated', { appeal, user });

    return appeal;
  }
}
