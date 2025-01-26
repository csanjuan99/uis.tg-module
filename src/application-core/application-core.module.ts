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
import { ResendVerifyInteractor } from './abstract/auth/use-cases/resendVerify.interactor';
import { VerifyInteractor } from './abstract/auth/use-cases/verify.interactor';
import { FindAppealByIdInteractor } from './appeal/use-cases/findAppealById.interactor';
import { FindAppealsInteractor } from './appeal/use-cases/findAppeals.interactor';
import { UpdateAppealByIdInteractor } from './appeal/use-cases/updateAppealById.interactor';
import { DeleteAppealByIdInteractor } from './appeal/use-cases/deleteAppealById.interactor';
import { CountAppealInteractor } from './appeal/use-cases/countAppeal.interactor';
import { CountSubjectsInteractor } from './subject/use-cases/countSubjects.interactor';
import { FindUsersInteractor } from './user/use-cases/findUsers.interactor';
import { CountUsersInteractor } from './user/use-cases/countUsers.interactor';
import { DeleteUserByIdInteractor } from './user/use-cases/deleteUserById.interactor';
import { FindUserByIdInteractor } from './user/use-cases/findUserById.interactor';
import { CreateUserInteractor } from './user/use-cases/createUser.interactor';
import { UpdateUserByIdInteractor } from './user/use-cases/updateUserById.interactor';
import { FindScheduleInteractor } from './schedule/use-cases/findSchedule.interactor';
import { FindScheduleByIdInteractor } from './schedule/use-cases/findScheduleById.interactor';
import { CreateScheduleInteractor } from './schedule/use-cases/createSchedule.interactor';
import { DeleteScheduleByIdInteractor } from './schedule/use-cases/deleteScheduleById.interactor';
import { CountSchedulesInteractor } from './schedule/use-cases/countSchedules.interactor';
import { UpdateScheduleByIdInteractor } from './schedule/use-cases/updateScheduleById.interactor';
import { AssignAppealHandler } from './appeal/event-handlers/assignAppeal.handler';
import { UpdateStudentInteractor } from './abstract/student/use-cases/UpdateStudent.interactor';
import { UpdatedAppealHandler } from './appeal/event-handlers/updatedAppeal.handler';
import { MeInteractor } from './abstract/auth/use-cases/me.interactor';
import { SendEmailByMailtrapInteractor } from './abstract/mailtrap/use-cases/sendEmailByMailtrap.interactor';
import { SendVerifyInteractor } from './abstract/auth/event-handlers/sendVerify.interactor';
import { RecoverPasswordInteractor } from './abstract/auth/use-cases/recoverPassword.interactor';
import { ChangePasswordInteractor } from './abstract/auth/use-cases/changePassword.interactor';

const SERVICES = [
  //AUTH
  LoginInteractor,
  RegisterInteractor,
  MeInteractor,
  VerifyInteractor,
  ChangePasswordInteractor,
  RecoverPasswordInteractor,
  ResendVerifyInteractor,
  // AUTH - EVENT HANDLERS
  SendVerifyInteractor,
  // MAILTRAP
  SendEmailByMailtrapInteractor,
  //SUBJECT
  FindSubjectsInteractor,
  FindSubjectBySkuInteractor,
  CreateSubjectInteractor,
  UpdateSubjectBySkuInteractor,
  DeleteSubjectBySkuInteractor,
  CountSubjectsInteractor,
  //APPEAL
  CreateAppealInteractor,
  FindAppealByIdInteractor,
  FindAppealsInteractor,
  UpdateAppealByIdInteractor,
  DeleteAppealByIdInteractor,
  CountAppealInteractor,
  AssignAppealHandler,
  UpdatedAppealHandler,
  //USER
  FindUsersInteractor,
  CountUsersInteractor,
  DeleteUserByIdInteractor,
  FindUserByIdInteractor,
  CreateUserInteractor,
  UpdateUserByIdInteractor,
  //SCHEDULE
  FindScheduleInteractor,
  FindScheduleByIdInteractor,
  CreateScheduleInteractor,
  DeleteScheduleByIdInteractor,
  CountSchedulesInteractor,
  UpdateScheduleByIdInteractor,
  //STUDENT
  UpdateStudentInteractor,
];

@Module({
  imports: [InfrastructureModule],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class ApplicationCoreModule {}
