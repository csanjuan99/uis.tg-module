import { Injectable } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { FindUserByIdInteractor } from '../../../user/use-cases/findUserById.interactor';
import { UpdateStudentRequest } from '../dto/student.dto';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UpdateStudentInteractor {
  constructor(
    private readonly findUserByIdInteractor: FindUserByIdInteractor,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(payload: UpdateStudentRequest): Promise<{ message: string }> {
    const student: UserDocument = await this.findUserByIdInteractor.execute(
      payload.studentId,
    );

    if (payload.password) {
      const salt: string = genSaltSync();
      payload.password = hashSync(payload.password, salt);
    }

    await this.userGateway.updateById(student.id, {
      name: payload.name,
      lastname: payload.lastname,
      shift: payload.shift,
      password: payload.password,
    });

    return {
      message: 'success',
    };
  }
}
