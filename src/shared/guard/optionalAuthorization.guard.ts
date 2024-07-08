import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { OptionalGuardToolsService } from './OptionalGuardTools.service';

@Injectable()
export class OptionalAuthorizationGuard implements CanActivate {
    constructor(
        private readonly GuardToolsService?: OptionalGuardToolsService
    ) { }

    async canActivate(Context: ExecutionContext) {
        const Request = Context.switchToHttp().getRequest();
        const Response = Context.switchToHttp().getResponse();



        if (!Request.headers.authorization || Request.headers.authorization == "" || Request.headers.authorization == 'Bearer') {
            Request.user = 'AuthorizationNotSet';
            return true;
        }

        Request.user = await this.GuardToolsService?.validateRequest(Request.headers.authorization);

        return true;
    }

}