/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { VerifyEmailResponse } from '../dto/verify-email.dto';

@Injectable()
export class VerifyEmailInteractor {
  constructor(private readonly userGateway: UserGateway) {}

  async execute(email: string): Promise<VerifyEmailResponse> {
    const user: UserDocument = await this.userGateway.findOne({
      username: email,
    });

    if (!user) {
      throw new NotFoundException(
        'No pudimos encontrar un usuario con ese correo electrónico',
      );
    }

    return {
      name: user.name,
      identification: user.identification,
      lastname: user.lastname,
      program: user.program,
      verified: user.verified,
      kind: user.kind,
    };
  }
}
