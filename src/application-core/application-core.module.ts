import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { LoginInteractor } from './abstract/auth/use-cases/login.interactor';
import { RegisterInteractor } from './abstract/auth/use-cases/register.interactor';
import { FindSubjectsInteractor } from './subject/use-cases/findSubjects.interactor';
import { FindSubjectBySkuInteractor } from './subject/use-cases/findSubjectBySku.interactor';
import { CreateSubjectInteractor } from './subject/use-cases/createSubject.interactor';
import { UpdateSubjectBySkuInteractor } from './subject/use-cases/updateSubjectBySku.interactor';
import { DeleteSubjectBySkuInteractor } from './subject/use-cases/deleteSubjectBySku.interactor';
import { CreateAppealInteractor } from './appeal/use-cases/createAppeal.interactor';
import { SendEmailInteractor } from './abstract/ses/use-cases/sendEmail.interactor';
import { OnSendVerifyInteractor } from './abstract/auth/use-cases/onSendVerify.interactor';
import { ResendVerifyInteractor } from './abstract/auth/use-cases/resendVerify.interactor';
import { VerifyInteractor } from './abstract/auth/use-cases/verify.interactor';
import { FindAppealByIdInteractor } from './appeal/use-cases/findAppealById.interactor';
import { FindAppealsInteractor } from './appeal/use-cases/findAppeals.interactor';
import { UpdateAppealByIdInteractor } from './appeal/use-cases/updateAppealById.interactor';
import { DeleteAppealByIdInteractor } from './appeal/use-cases/deleteAppealById.interactor';

const SERVICES = [
  //AUTH
  LoginInteractor,
  RegisterInteractor,
  VerifyInteractor,
  ResendVerifyInteractor,
  OnSendVerifyInteractor,
  //SES
  SendEmailInteractor,
  //SUBJECT
  FindSubjectsInteractor,
  FindSubjectBySkuInteractor,
  CreateSubjectInteractor,
  UpdateSubjectBySkuInteractor,
  DeleteSubjectBySkuInteractor,
  //APPEAL
  CreateAppealInteractor,
  FindAppealByIdInteractor,
  FindAppealsInteractor,
  UpdateAppealByIdInteractor,
  DeleteAppealByIdInteractor,
];

@Module({
  imports: [InfrastructureModule],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class ApplicationCoreModule {}
