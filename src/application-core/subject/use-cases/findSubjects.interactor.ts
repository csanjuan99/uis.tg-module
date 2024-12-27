import { Injectable } from '@nestjs/common';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import { FilterQuery, ProjectionFields, QueryOptions } from 'mongoose';
import { Subject } from '../../../infrastructure/persistence/schema/subject.schema';

@Injectable()
export class FindSubjectsInteractor {
  constructor(private readonly subjectGateway: SubjectGateway) {}

  async execute(
    filter: FilterQuery<Subject>,
    projection?: ProjectionFields<Subject>,
    options?: QueryOptions,
  ) {
    return this.subjectGateway.find(filter, projection, options);
  }
}
