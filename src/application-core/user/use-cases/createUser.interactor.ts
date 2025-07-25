/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  Scope,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { CreateUserRequest } from '../dto/user.dto';
import { hashSync } from 'bcryptjs';
import { UserDocument } from '../../../infrastructure/persistence/schema/user.schema';

interface Program {
  id: number;
  name: string;
  new_pensum: boolean;
}

interface SessionUser {
  id: string;
  name: string;
  lastname: string;
  identification?: string;
  shift?: string;
  username: string;
  permissions: string[];
  kind: string;
  program: Program;
}

interface AuthenticatedRequest extends Request {
  user: SessionUser;
}

@Injectable({ scope: Scope.REQUEST })
export class CreateUserInteractor {
  constructor(
    private readonly userGateway: UserGateway,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  async execute(payload: CreateUserRequest) {
    const creatorProgram = this.request.user?.program;

    if (!creatorProgram?.id || !creatorProgram?.name) {
      throw new BadRequestException(
        'El usuario autenticado no tiene un programa asignado',
      );
    }

    payload.program = {
      id: creatorProgram.id,
      name: creatorProgram.name,
    };

    const existingUser: UserDocument = await this.userGateway.findOne({
      username: payload.username,
    });

    if (existingUser) {
      throw new BadRequestException(
        'Ya existe un usuario registrado con este nombre de usuario',
      );
    }

    // Hash de la contraseña
    payload.password = hashSync(payload.password, 10);

    return this.userGateway.create(payload);
  }
}
