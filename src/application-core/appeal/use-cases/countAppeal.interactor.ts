/* eslint-disable prettier/prettier */
import { Injectable, Scope, Inject, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { UserGateway } from '../../../infrastructure/persistence/gateway/user.gateway';
import { FilterQuery } from 'mongoose';
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
export class CountAppealInteractor {
  private readonly logger = new Logger(CountAppealInteractor.name);

  constructor(
    private readonly appealGateway: AppealGateway,
    private readonly userGateway: UserGateway,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  async execute(payload?: FilterQuery<Appeal>) {
    const sessionProgramId = this.request.user?.program?.id;

    if (!sessionProgramId) {
      return 0;
    }

    const students = await this.userGateway.find(
      { 'program.id': sessionProgramId },
      { _id: 1 },
    );
    const studentIds = students.map((s) => s._id);

    const enhancedPayload: FilterQuery<Appeal> = {
      ...payload,
      student: { $in: studentIds },
    };

    return this.appealGateway.count(enhancedPayload);
  }
}
