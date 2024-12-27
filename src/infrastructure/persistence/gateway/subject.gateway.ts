import { Injectable } from '@nestjs/common';
import { IGateway } from '../../interface/IGateway';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from '../schema/subject.schema';

@Injectable()
export class SubjectGateway extends IGateway<SubjectDocument, Subject> {
  constructor(@InjectModel(Subject.name) model: Model<SubjectDocument>) {
    super(model);
  }
}
