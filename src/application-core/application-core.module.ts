import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { LoginInteractor } from './abstract/auth/use-cases/login.interactor';
import { RegisterInteractor } from './abstract/auth/use-cases/register.interactor';

const SERVICES = [LoginInteractor, RegisterInteractor];

@Module({
  imports: [InfrastructureModule],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class ApplicationCoreModule {}
