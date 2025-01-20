import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class StudentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const student: Express.User = request.user;

    if (!student) {
      throw new UnauthorizedException();
    }

    request.body.studentId = student['id'];
    request.body.user = student;
    request.headers['student'] = JSON.stringify(student);

    return next.handle();
  }
}
