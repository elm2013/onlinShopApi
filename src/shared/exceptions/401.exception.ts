import { HttpException } from '@nestjs/common';

export class UnAuthenticationException extends HttpException {
  constructor(message?: string) {
    super(
      {
        status: 401,
        success:false,
        date:new Date(),
        message: message?message:'شما وارد سیستم نشده اید',
        
      },
      401,
    );
  }
}