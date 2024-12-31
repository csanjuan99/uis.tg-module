import { Injectable } from '@nestjs/common';
import { IGateway } from '../../interface/IGateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appeal, AppealDocument } from '../schema/appeal.schema';

@Injectable()
export class AppealGateway extends IGateway<AppealDocument, Appeal> {
  constructor(@InjectModel(Appeal.name) model: Model<AppealDocument>) {
    super(model);
  }
}
