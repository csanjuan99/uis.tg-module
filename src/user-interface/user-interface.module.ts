import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ApplicationCoreModule } from '../application-core/application-core.module';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [AuthController],
})
export class UserInterfaceModule {}
