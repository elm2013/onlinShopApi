import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';

  
  export interface Response<T> {
    data: T;
  }
  
  @Injectable()
  export class transformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {
      return next.handle().pipe(
        map(data => ({
          date: new Date(),
          success: true,
          status: context.switchToHttp().getResponse().statusCode,
          message: 'درخواست با موفقیت انجام شد.',
          data : data,
        })),
      );
    }
  }
  