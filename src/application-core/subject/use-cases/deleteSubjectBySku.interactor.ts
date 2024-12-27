import { Injectable } from '@nestjs/common';
import { SubjectGateway } from '../../../infrastructure/persistence/gateway/subject.gateway';
import { FindSubjectBySkuInteractor } from './findSubjectBySku.interactor';
import { SubjectDocument } from '../../../infrastructure/persistence/schema/subject.schema';

@Injectable()
export class DeleteSubjectBySkuInteractor {
  constructor(
    private readonly findSubjectBySkuInteractor: FindSubjectBySkuInteractor,
    private readonly subjectGateway: SubjectGateway,
  ) {}

  async execute(sku: string) {
    const subject: SubjectDocument =
      await this.findSubjectBySkuInteractor.execute(sku);
    return this.subjectGateway.deleteOne({ sku: subject.sku });
  }
}
