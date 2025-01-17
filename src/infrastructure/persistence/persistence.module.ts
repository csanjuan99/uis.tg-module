import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserGateway } from './gateway/user.gateway';
import { Subject, SubjectSchema } from './schema/subject.schema';
import { SubjectGateway } from './gateway/subject.gateway';
import { Appeal, AppealSchema } from './schema/appeal.schema';
import { AppealGateway } from './gateway/appeal.gateway';
import { Schedule, ScheduleSchema } from './schema/schedule.schema';
import { ScheduleGateway } from './gateway/shedule.gateway';

const SERVICES = [AppealGateway, UserGateway, SubjectGateway, ScheduleGateway];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Appeal.name,
        schema: AppealSchema,
      },
      {
        name: Schedule.name,
        schema: ScheduleSchema,
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
