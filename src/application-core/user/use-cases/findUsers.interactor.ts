/* eslint-disable prettier/prettier */
import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FilterQuery, ProjectionFields, QueryOptions } from 'mongoose';
import { User } from '../../../infrastructure/persistence/schema/user.schema';

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
export class FindUsersInteractor {
  private readonly logger = new Logger(FindUsersInteractor.name);

  constructor(
    private readonly userGateway: UserGateway,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  async execute(
    payload?: FilterQuery<User>,
    projection?: ProjectionFields<User>,
    options?: QueryOptions,
  ) {
    const sessionUserProgram = this.request.user.program;

    this.logger.log(
      `Usuario ${this.request.user.username} con program ID: ${sessionUserProgram.id} (${sessionUserProgram.name})`,
    );
    const enhancedPayload = {
      ...payload,
      'program.id': sessionUserProgram.id,
    };

    const users = await this.userGateway.find(
      enhancedPayload,
      projection,
      options,
    );

    return users;
  }
}
