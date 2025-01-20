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

    request.body.studentId = student['id'];
    request.body.user = student;
    request.headers['student'] = JSON.stringify(student);

    return next.handle();
  }
}
