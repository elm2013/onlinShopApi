import {
  ValidationPipe,
  ArgumentMetadata,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class Validation extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const errorResponse = e.getResponse();
        const firstError = errorResponse['message'][0];
        const errorDetails = {
          status: 422,
          success: false,
          date: new Date(),
          message: Object.values(firstError.constraints)[0],
          field: firstError.property,
        };


        throw new UnprocessableEntityException(errorDetails,);
      }
    }
  }
}
