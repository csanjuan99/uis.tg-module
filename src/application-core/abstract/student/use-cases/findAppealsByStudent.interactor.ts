import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { AppealGateway } from '../../../../infrastructure/persistence/gateway/appeal.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class FindAppealsByStudentInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
  ) {}

  async execute(payload: Express.User) {
    const user: UserDocument = await this.userGateway.findById(
      (payload as UserDocument).id,
    );

    if (!user) {
      throw new NotFoundException('No pudimos encontrar el usuario');
    }

    return await this.appealGateway.find({
      studentId: user.id,
    });
  }
}
