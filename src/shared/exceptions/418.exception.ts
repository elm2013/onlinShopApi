import { HttpException } from '@nestjs/common';

export class ExpiredRefreshTokenException extends HttpException {
  constructor(message?:string) {
    super(
        {
            status: 418,
            success:false,
            date:new Date(),
            message:message?message:'رفرش توکن منقضی شده است.',
          
      },
      418
    );
  }
}