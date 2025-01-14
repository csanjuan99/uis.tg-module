import { BadRequestException, Injectable } from '@nestjs/common';
import { UserGateway } from '../../../../infrastructure/persistence/gateway/user.gateway';
import { UserDocument } from '../../../../infrastructure/persistence/schema/user.schema';
import { RegisterRequest } from '../dto/register.dto';
import { genSaltSync, hashSync } from 'bcryptjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';

@Injectable()
export class RegisterInteractor {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userGateway: UserGateway,
  ) {}

  async execute(payload: RegisterRequest, req: Request): Promise<UserDocument> {
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

    const student: UserDocument = await this.userGateway.create({
      name: payload.name,
      lastname: payload.lastname,
      identification: payload.identification,
      username: payload.email,
      password: hash,
      kind: 'STUDENT',
      permissions: [
        'write:appeal',
        'read:appeal',
        'delete:appeal',
        'read:subject',
      ],
    });

    this.eventEmitter.emit('onVerify', req, student);

    return student;
  }
}
