import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { SubjectController } from './controllers/subject.controller';
import { AppealController } from './controllers/appeal.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [
    AppealController,
    AuthController,
    SubjectController,
    UserController,
  ],
})
export class UserInterfaceModule {}
