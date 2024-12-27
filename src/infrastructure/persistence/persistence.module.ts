import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserGateway } from './gateway/user.gateway';
import { Subject, SubjectSchema } from './schema/subject.schema';
import { SubjectGateway } from './gateway/subject.gateway';

const SERVICES = [UserGateway, SubjectGateway];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
    ]),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class PersistenceModule {}
