import { HttpException } from '@nestjs/common';

export class CodeErrorException extends HttpException {
  constructor(msg?:string) {
    super(
      {
        status: 500,
        success:false,
        date:new Date(),
        message: msg?msg:'خطای سیستمی, لطفا دوباره تلاش کنید'
        
      },
      500,
    );
  }
}
