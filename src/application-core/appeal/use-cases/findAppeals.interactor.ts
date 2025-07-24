/* eslint-disable prettier/prettier */
import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FilterQuery, ProjectionFields, QueryOptions } from 'mongoose';
import { Appeal } from '../../../infrastructure/persistence/schema/appeal.schema';


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
export class FindAppealsInteractor {
  private readonly logger = new Logger(FindAppealsInteractor.name);

  constructor(
    private readonly appealGateway: AppealGateway,
    private readonly userGateway: UserGateway,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  async execute(
    filter?: FilterQuery<Appeal>,
    projection?: ProjectionFields<Appeal>,
    options?: QueryOptions,
  ) {
    const sessionUserProgramId = this.request.user.program?.id;

    if (!sessionUserProgramId) {
      this.logger.warn(`El usuario ${this.request.user.username} no tiene un programa asignado`);
      return [];
    }

    const studentsInProgram = await this.userGateway.find(
      { 'program.id': sessionUserProgramId },
      { _id: 1 }
    );

    const studentIds = studentsInProgram.map((student) => student._id);

    const enhancedFilter: FilterQuery<Appeal> = {
      ...filter,
      student: { $in: studentIds }
    };

    return this.appealGateway.find(enhancedFilter, projection, options);
  }
}
