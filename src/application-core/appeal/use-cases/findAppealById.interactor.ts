import { Injectable, NotFoundException } from '@nestjs/common';
import { AppealGateway } from '../../../infrastructure/persistence/gateway/appeal.gateway';
import { ProjectionFields, QueryOptions } from 'mongoose';
import {
  Appeal,
  AppealDocument,
} from '../../../infrastructure/persistence/schema/appeal.schema';

@Injectable()
export class FindAppealByIdInteractor {
  constructor(private readonly appealGateway: AppealGateway) {}

  async execute(
    id: string,
    projection?: ProjectionFields<Appeal>,
    options?: QueryOptions,
  ) {
    const appeal: AppealDocument = await this.appealGateway.findById(
      id,
      projection,
      options,
    );

    if (!appeal) {
      throw new NotFoundException('No pudimos encontrar esta apelación');
    }

    return appeal;
  }
}
