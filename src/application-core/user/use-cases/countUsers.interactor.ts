import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FilterQuery } from 'mongoose';
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
export class CountUsersInteractor {
  private readonly logger = new Logger(CountUsersInteractor.name);

  constructor(
    private readonly userGateway: UserGateway,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  async execute(payload?: FilterQuery<User>) {
    const sessionProgramId = this.request.user?.program?.id;

    if (!sessionProgramId) {
      return 0;
    }

    const enhancedPayload: FilterQuery<User> = {
      ...payload,
      'program.id': sessionProgramId,
    };

    return this.userGateway.count(enhancedPayload);
  }
}
