import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { AppealDocument } from '../../../infrastructure/persistence/schema/appeal.schema';
import { FindAppealByIdInteractor } from './findAppealById.interactor';

@Injectable()
export class ScaleAppealInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const user: UserDocument = await this.userGateway.findOne({
      kind: 'ROOT',
    });

    if (!user) {
      throw new NotFoundException('No pudimos encontrar un usuario raíz');
    }

    const appeal: AppealDocument = await this.findAppealByIdInteractor.execute(
      id,
      null,
      {
        populate: {
          path: 'attended',
        },
      },
    );

    if (!appeal.attended) {
      throw new NotFoundException(
        'No se puede escalar una solicitud sin antes ser asignada',
      );
    }

    appeal.logs.push({
      message: `La solicitud ha sido escalada por ${appeal.attended.name} ${appeal.attended.lastname}`,
      user: appeal.attended,
    });
    appeal.attended = user.id;

    await appeal.save();

    return {
      message: 'success',
    };
  }
}
