import { BadRequestException, Injectable } from '@nestjs/common';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import { CreateSubjectRequest } from '../dto/subject.dto';
import { SubjectDocument } from '../../../infrastructure/persistence/schema/subject.schema';

@Injectable()
export class CreateSubjectInteractor {
  constructor(private readonly subjectGateway: SubjectGateway) {}

  async execute(payload: CreateSubjectRequest) {
    const subject: SubjectDocument = await this.subjectGateway.findOne({
      sku: payload.sku,
    });
    if (subject) {
      throw new BadRequestException('Ya existe una materia con este codigo');
    }
    return this.subjectGateway.create(payload);
  }
}
