import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { LoginInteractor } from './abstract/auth/use-cases/login.interactor';
import { RegisterInteractor } from './abstract/auth/use-cases/register.interactor';
import { FindSubjectsInteractor } from './subject/use-cases/findSubjects.interactor';
import { FindSubjectBySkuInteractor } from './subject/use-cases/findSubjectBySku.interactor';
import { CreateSubjectInteractor } from './subject/use-cases/createSubject.interactor';
import { UpdateSubjectBySkuInteractor } from './subject/use-cases/updateSubjectBySku.interactor';
import { DeleteSubjectBySkuInteractor } from './subject/use-cases/deleteSubjectBySku.interactor';

const SERVICES = [
  LoginInteractor,
  RegisterInteractor,
  FindSubjectsInteractor,
  FindSubjectBySkuInteractor,
  CreateSubjectInteractor,
  UpdateSubjectBySkuInteractor,
  DeleteSubjectBySkuInteractor,
];

@Module({
  imports: [InfrastructureModule],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class ApplicationCoreModule {}
