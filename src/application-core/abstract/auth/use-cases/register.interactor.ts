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

    switch (payload.program?.id) {
      case 11:
        payload.program.name = 'INGENIERIA DE SISTEMAS';
        break;
      case 27:
        payload.program.name = 'DISEÑO INDUSTRIAL';
        break;
      case 69:
        payload.program.name = 'INGENIERIA BIOMEDICA';
        break;
      case 50:
        payload.program.name = 'INGENIERIA EN CIENCIA DE DATOS';
        break;
      case 21:
        payload.program.name = 'INGENIERIA CIVIL';
        break;
      case 14:
        payload.program.name = 'QUIMICA';
        break;
      case 58:
        payload.program.name = 'MICROBIOLOGIA';
        break;
      case 24:
        payload.program.name = 'INGENIERIA MECANICA';
        break;
      case 23:
        payload.program.name = 'INGENIERIA INDUSTRIAL';
        break;
      case 33:
        payload.program.name = 'INGENIERIA QUIMICA';
        break;
      case 57:
        payload.program.name = 'NUTRICION';
        break;
      case 47:
        payload.program.name = 'INGENIERIA EN INTELIGENCIA ARTIFICIAL';
        break;
      default:
        throw new BadRequestException('Programa no válido');
    }

    const student: UserDocument = await this.userGateway.create({
      name: payload.name,
      lastname: payload.lastname,
      identification: payload.identification,
      username: payload.email,
      program: payload.program,
      password: hash,
      kind: 'STUDENT',
      permissions: [
        'read:schedule',
        'write:schedule',
        'delete:schedule',
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
