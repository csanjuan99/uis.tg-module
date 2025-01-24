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

@Injectable()
export class AppealInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as UserDocument;
    const payload = request.body as AppealDocument;

    if (user['kind'] == 'STUDENT') {
      throw new ForbiddenException('No puedes acceder a este recurso');
    }

    if (user.id !== payload.attendedBy) {
      throw new BadRequestException('Esta solicitud ya ha sido asignada');
    }

    return next.handle();
  }
}
