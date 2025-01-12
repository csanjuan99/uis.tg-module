import { Injectable, NotFoundException } from '@nestjs/common';
import { AppealDocument } from '../../../../infrastructure/persistence/schema/appeal.schema';
import { AppealGateway } from '../../../../infrastructure/persistence/gateway/appeal.gateway';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class FindStudentAppealByIdInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
  ) {}

  async execute(id: string, payload: Express.User): Promise<AppealDocument> {
    const user: UserDocument = await this.userGateway.findById(
      (payload as UserDocument).id,
    );

    if (!user) {
      throw new NotFoundException('No pudimos encontrar el usuario');
    }

    const appeal: AppealDocument = await this.appealGateway.findOne({
      studentId: user.id,
      _id: id,
    });

    if (!appeal) {
      throw new NotFoundException('No pudimos encontrar la apelación');
    }

    return appeal;
  }
}
