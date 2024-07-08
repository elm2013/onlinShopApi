import { Injectable, NestInterceptor, CallHandler,  ExecutionContext, BadRequestException,UnprocessableEntityException } from '@nestjs/common';
import { MulterError } from 'multer';
import { Observable, throwError } from 'rxjs';
import { catchError ,map} from 'rxjs/operators';
@Injectable()
export class MulterErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    // const req = context.switchToHttp().getRequest<Request>();
    // const uploadedFile = (req as any).file;
    // console.log(uploadedFile);
    
    return next.handle().pipe(
        catchError((error) => {
            let res = {
                status: 422,
                success:false,
                date:new Date(),
                message:'',
               
              };  
            
            if (error instanceof MulterError) {
                switch (error.code) {
                    case 'LIMIT_FILE_SIZE':
                        res.message='File size exceeds the allowed limit'
                        // throw new BadRequestException('File size exceeds the allowed limit');
                      case 'LIMIT_FILE_COUNT':
                        res.message='Exceeded the maximum number of files allowed'
                        // throw new BadRequestException('Exceeded the maximum number of files allowed');
                      case 'LIMIT_FIELD_COUNT':
                        res.message='Exceeded the maximum number of fields allowed'
                        // throw new BadRequestException('Exceeded the maximum number of fields allowed');
                      case 'LIMIT_UNEXPECTED_FILE':
                        res.message='Unexpected file received'
                        // throw new BadRequestException('Unexpected file received');
                      default:
                        res.message='Unknown error occurred'
                        // throw new BadRequestException('Unknown error occurred');
                }
            
            } else { 
                 console.log("Error----------->:", error); // چاپ متن خطا در کنسول
                 res.message=error.message
                // throw new BadRequestException(error.message); // پرتاب خطا به خروجی
            }
                 
      
              throw new UnprocessableEntityException(res,);
          })
    );
  }
}

