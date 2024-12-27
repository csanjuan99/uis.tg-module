import { Injectable, NotFoundException } from '@nestjs/common';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import {
  Subject,
  SubjectDocument,
} from '../../../infrastructure/persistence/schema/subject.schema';
import { ProjectionFields } from 'mongoose';

@Injectable()
export class FindSubjectBySkuInteractor {
  constructor(private readonly subjectGateway: SubjectGateway) {}

  async execute(
    sku: string,
    projection?: ProjectionFields<Subject>,
  ): Promise<SubjectDocument> {
    const subject: SubjectDocument = await this.subjectGateway.findOne(
      {
        sku,
      },
      projection,
    );

    if (!subject) {
      throw new NotFoundException('No se pudo encontrar esta materia');
    }

    return subject;
  }
}
