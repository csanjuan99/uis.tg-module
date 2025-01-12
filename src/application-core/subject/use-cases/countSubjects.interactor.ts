import { Injectable } from '@nestjs/common';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import { FilterQuery } from 'mongoose';
import { Subject } from '../../../infrastructure/persistence/schema/subject.schema';

@Injectable()
export class CountSubjectsInteractor {
  constructor(private readonly subjectGateway: SubjectGateway) {}

  async execute(payload?: FilterQuery<Subject>) {
    return this.subjectGateway.count(payload);
  }
}
