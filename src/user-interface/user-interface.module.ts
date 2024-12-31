import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { SubjectController } from './controllers/subject.controller';
import { AppealController } from './controllers/appeal.controller';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [AppealController, AuthController, SubjectController],
})
export class UserInterfaceModule {}
