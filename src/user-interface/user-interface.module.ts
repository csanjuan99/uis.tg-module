import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { SubjectController } from './controllers/subject.controller';
import { AppealController } from './controllers/appeal.controller';
import { UserController } from './controllers/user.controller';
import { StudentController } from './controllers/student.controller';
import { ScheduleController } from './controllers/schedule.controller';

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
