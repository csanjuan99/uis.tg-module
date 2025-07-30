import { Injectable, Inject, Scope, Logger } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import { FilterQuery, ProjectionFields, QueryOptions } from 'mongoose';
import { Subject } from '../../../infrastructure/persistence/schema/subject.schema';

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
export class FindSubjectsInteractor {
  private readonly logger = new Logger(FindSubjectsInteractor.name);

  constructor(
    private readonly subjectGateway: SubjectGateway,
    @Inject(REQUEST) private readonly request: AuthenticatedRequest,
  ) {}

  async execute(
    filter?: FilterQuery<Subject>,
    projection?: ProjectionFields<Subject>,
    options?: QueryOptions,
  ) {
    const sessionUser = this.request.user;

    if (!sessionUser?.program?.id) {
      this.logger.warn(`Usuario ${sessionUser.username} sin program.id`);
      throw new Error('El usuario autenticado no tiene un programa asociado.');
    }

    const programId = sessionUser.program.id;
    const pensum = sessionUser.program.new_pensum;

    this.logger.log(
      `Usuario ${sessionUser.username} accediendo a materias con program.id: ${programId} (${sessionUser.program.name})`,
    );

    const enhancedFilter = {
      ...filter,
      'program.id': programId,
      'program.new_pensum': pensum,
    };

    const subjects = await this.subjectGateway.find(
      enhancedFilter,
      projection,
      options,
    );

    this.logger.log(
      `Se encontraron ${subjects.length} materias para program.id ${programId}`,
    );

    return subjects;
  }
}
