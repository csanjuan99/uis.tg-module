import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { AppealGateway } from '../../../../infrastructure/persistence/gateway/appeal.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { FilterQuery } from 'mongoose';
import { Appeal } from '../../../../infrastructure/persistence/schema/appeal.schema';

@Injectable()
export class FindAppealsByStudentInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    private readonly appealGateway: AppealGateway,
  ) {}

  async execute(user: Express.User, payload: FilterQuery<Appeal>) {
    const student: UserDocument = await this.userGateway.findById(
      (user as UserDocument).id,
    );

    if (!student) {
      throw new NotFoundException('No pudimos encontrar el usuario');
    }

    return await this.appealGateway.find({
      studentId: student.id,
      ...payload,
    });
  }
}
