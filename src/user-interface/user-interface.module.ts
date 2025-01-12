import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { SubjectController } from './controllers/subject.controller';
import { AppealController } from './controllers/appeal.controller';
import { UserController } from './controllers/user.controller';
import { StudentController } from './controllers/student.controller';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [
    AppealController,
    AuthController,
    StudentController,
    SubjectController,
    UserController,
  ],
})
export class UserInterfaceModule {}
