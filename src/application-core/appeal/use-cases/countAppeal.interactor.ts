import { QueryOptions } from 'mongoose';
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

  async execute(payload?: FilterQuery<Appeal>, options?: QueryOptions) {
    const sessionProgramId = this.request.user?.program?.id;
    const shifts = Array.isArray(options?.shifts)
      ? options.shifts
      : JSON.parse(options?.shifts || '[]');
    const levels = Array.isArray(options?.levels)
      ? options.levels
      : JSON.parse(options?.levels || '[]');

    if (!sessionProgramId) {
      return 0;
    }

    const studentFilter: FilterQuery<any> = {
      'program.id': sessionProgramId,
    };

    // Si se proporcionan turnos, los agregamos al filtro de estudiantes
    if (shifts.length > 0) {
      studentFilter['shift'] = {
        $in: shifts.map((shift) => ({
          day: shift.day,
          time: shift.time,
        })),
      };
    }

    // Si se proporcionan niveles, los agregamos al filtro de estudiantes
    if (levels.length > 0) {
      studentFilter['level'] = { $in: levels };
    }

    const students = await this.userGateway.find(studentFilter, {
      _id: 1,
    });

    const studentIds = students.map((s) => s._id);

    const enhancedPayload: FilterQuery<Appeal> = {
      ...payload,
      student: { $in: studentIds },
    };

    return this.appealGateway.count(enhancedPayload);
  }
}
