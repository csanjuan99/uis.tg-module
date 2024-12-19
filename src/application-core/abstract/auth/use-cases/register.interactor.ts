import { BadRequestException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { RegisterRequest } from '../dto/register.dto';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class RegisterInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(payload: RegisterRequest): Promise<UserDocument> {
    const user: UserDocument = await this.userGateway.findOne({
      username: payload.email,
    });

    if (user) {
      throw new BadRequestException(
        'Ya existe una cuenta asociada a este correo electrónico',
      );
    }

    const salt: string = genSaltSync(10);
    const hash: string = hashSync(payload.password, salt);

    return await this.userGateway.create({
      username: payload.email,
      password: hash,
      kind: 'STUDENT',
      permissions: [],
    });
  }
}
