import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { LoginInteractor } from './abstract/auth/use-cases/login.interactor';

const SERVICES = [LoginInteractor];

@Module({
  imports: [InfrastructureModule],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class ApplicationCoreModule {}
