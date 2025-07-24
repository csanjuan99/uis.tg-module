/* eslint-disable prettier/prettier */
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
      case 32:
        payload.program.name = 'INGENIERIA DE PETROLEOS';
        break;
      default:
        throw new BadRequestException('Programa no válido');
    }

    // Hash de la contraseña
    payload.password = hashSync(payload.password, 10);

    const result = await this.userGateway.create(payload);

    return result;
  }
}
