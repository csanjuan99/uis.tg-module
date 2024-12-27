import { Get, Module, Query } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ApplicationCoreModule } from '../application-core/application-core.module';
import { SubjectController } from './controllers/subject.controller';
import { Public } from '../application-core/abstract/auth/decorator/public.decorator';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [AuthController, SubjectController],
})
export class UserInterfaceModule {}
