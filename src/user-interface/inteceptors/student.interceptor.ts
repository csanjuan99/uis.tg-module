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
    const user: Express.User = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    request.body.user = user;
    request.headers['user'] = JSON.stringify(user);

    return next.handle();
  }
}
