import { Injectable, NotFoundException } from '@nestjs/common';
import { AppealGateway } from '../../../../infrastructure/persistence/gateway/appeal.gateway';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { Appeal } from '../../../../infrastructure/persistence/schema/appeal.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class CountAppealsByStudentInteractor {
  constructor(
    private readonly appealGateway: AppealGateway,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(user: Express.User, payload: FilterQuery<Appeal>) {
    const student: UserDocument = await this.userGateway.findById(
      (user as UserDocument).id,
    );

    if (!student) {
      throw new NotFoundException('No pudimos encontrar el estudiante');
    }

    return this.appealGateway.count({
      studentId: student.id,
      ...payload,
    });
  }
}
