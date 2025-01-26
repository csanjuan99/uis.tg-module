import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserDocument } from '../../infrastructure/persistence/schema/user.schema';
import { AppealDocument } from '../../infrastructure/persistence/schema/appeal.schema';
import { FindAppealByIdInteractor } from '../../application-core/appeal/use-cases/findAppealById.interactor';

@Injectable()
export class AppealInterceptor implements NestInterceptor {
  constructor(
    private readonly findAppealByIdInteractor: FindAppealByIdInteractor,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserDocument;
    const id: string = request.params['id'];

    if (user['kind'] == 'STUDENT') {
      throw new ForbiddenException('No puedes modificar esta solicitud');
    }

    const appeal: AppealDocument = await this.findAppealByIdInteractor.execute(
      id,
      null,
      {
        populate: {
          path: 'attended',
          select: '_id',
        },
      },
    );

    if (!appeal.attended) {
      return next.handle();
    } else {
      if (user.id !== appeal.attended['id']) {
        throw new BadRequestException('Esta solicitud ya ha sido asignada');
      }
    }

    return next.handle();
  }
}
