import { HttpException } from '@nestjs/common';

export class RequestActivationCodeRepeatedlyErrorException extends HttpException {
  constructor() {
    super(
        { 
            status: 409,
            success:false,
            date:new Date(),
            message:'امکان درخواست به صورت مکرر وجود ندارد.',
            
      },
      409
    );
  }
}