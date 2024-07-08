import { HttpException } from '@nestjs/common';

export class notAllow extends HttpException {
  constructor(message?) {
    super(
      {
        status: 403,
        success:false,
        date:new Date(),
        message: message?message:'شما قادر به انجام این پروسه نیستید'
        
      },
      403,
    );
  }
}
