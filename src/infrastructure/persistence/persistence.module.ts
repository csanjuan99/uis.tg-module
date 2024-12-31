import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserGateway } from './gateway/user.gateway';
import { Subject, SubjectSchema } from './schema/subject.schema';
import { SubjectGateway } from './gateway/subject.gateway';
import { Appeal, AppealSchema } from './schema/appeal.schema';
import { AppealGateway } from './gateway/appeal.gateway';

const SERVICES = [AppealGateway, UserGateway, SubjectGateway];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Appeal.name,
        schema: AppealSchema,
      },
      {
        name: Subject.name,
        schema: SubjectSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class PersistenceModule {}
