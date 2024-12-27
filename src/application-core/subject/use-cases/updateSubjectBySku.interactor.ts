import { Injectable } from '@nestjs/common';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import { FindSubjectBySkuInteractor } from './findSubjectBySku.interactor';
import { SubjectDocument } from '../../../infrastructure/persistence/schema/subject.schema';
import { UpdateSubjectRequest } from '../dto/subject.dto';

@Injectable()
export class UpdateSubjectBySkuInteractor {
  constructor(
    private readonly findSubjectBySkuInteractor: FindSubjectBySkuInteractor,
    private readonly subjectGateway: SubjectGateway,
  ) {}

  async execute(sku: string, payload: UpdateSubjectRequest) {
    const subject: SubjectDocument =
      await this.findSubjectBySkuInteractor.execute(sku);

    return this.subjectGateway.updateOne(
      {
        sku: subject.sku,
      },
      payload,
    );
  }
}
