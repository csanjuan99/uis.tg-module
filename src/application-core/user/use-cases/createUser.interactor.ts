import { BadRequestException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { CreateUserRequest } from '../dto/user.dto';
import { hashSync } from 'bcryptjs';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';

@Injectable()
export class CreateUserInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload: CreateUserRequest) {
    const user: UserDocument = await this.userGateway.findOne({
      username: payload.username,
    });

    if (user) {
      throw new BadRequestException(
        'Ya existe un usuario registrado con este nombre de usuario',
      );
    }

    payload.password = hashSync(payload.password, 10);

    return this.userGateway.create(payload);
  }
}
