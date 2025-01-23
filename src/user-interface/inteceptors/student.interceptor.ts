import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class StudentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const student: Express.User = request.user;

    if (student['kind'] !== 'STUDENT') {
      throw new ForbiddenException('No puedes acceder a este recurso');
    }

    request.body = {
      ...request.body,
      student: student,
      studentId: student['id'],
    };

    return next.handle();
  }
}
