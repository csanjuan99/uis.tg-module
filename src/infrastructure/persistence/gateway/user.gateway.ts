import { Injectable } from '@nestjs/common';
import { IGateway } from '../../interface/IGateway';
import { User, UserDocument } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserGateway extends IGateway<UserDocument, User> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }
}
