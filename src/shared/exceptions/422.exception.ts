import { HttpException } from '@nestjs/common';

export class InvalidDataException extends HttpException {
  constructor(data:any) {
    super(
      {
        status: 422,
        success:false,
        date:new Date(),
        message: data.message,
        field:data.field
        
      },
      422,
    );
  }
}
