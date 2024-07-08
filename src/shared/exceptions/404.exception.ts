import { HttpException } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(data:any) {
    super(
      {
        status: 404,
        success:false,
        date:new Date(),
        message: data.message      
        
      },
      404,
    );
  }
}
