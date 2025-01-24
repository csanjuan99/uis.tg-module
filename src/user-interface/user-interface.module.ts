import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { SubjectController } from './controllers/subject.controller';
import { AppealController } from './controllers/appeal.controller';
import { UserController } from './controllers/user.controller';
import { ScheduleController } from './controllers/schedule.controller';
import { StudentController } from './controllers/abstract/student.controller';
import { AuthController } from './controllers/abstract/auth.controller';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [
    AppealController,
    AuthController,
    ScheduleController,
    StudentController,
    SubjectController,
    UserController,
  ],
})
export class UserInterfaceModule {}
