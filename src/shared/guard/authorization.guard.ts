import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { UnAuthenticationException } from './../exceptions/401.exception';
import { GuardToolsService } from './guardTools.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private readonly GuardToolsService?: GuardToolsService
    ) { }

    async canActivate(Context: ExecutionContext) {
        const Request = Context.switchToHttp().getRequest();
        const Response = Context.switchToHttp().getResponse();

        if (!Request.headers.authorization) {
            throw new UnAuthenticationException("توکن دسترسی وارد نشده.لطفا توکن را وارد وسپس مجدد تلاش کنید.")
        }

        let userId = await this.GuardToolsService?.validateRequest(Request.headers.authorization)
        Request.user = userId;

        return true;
    }

}