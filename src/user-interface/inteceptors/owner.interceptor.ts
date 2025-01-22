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
export class OwnerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const user: Express.User = request.user;
    const resource = request.headers['x-resource-id'] as string;

    if (user['kind'] !== 'STUDENT') {
      return next.handle();
    }

    if (user['id'] !== resource) {
      throw new ForbiddenException('No puedes acceder a este recurso');
    }

    return next.handle();
  }
}
