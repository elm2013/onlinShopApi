import { Injectable } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';


var fs = require('fs');
var CryptoJS = require("crypto-js");


@Injectable()
export class OptionalGuardToolsService {

    constructor(

    ) { }

    async validateRequest(authorization: String) {
        let userId = null
        let accountId = null
        if (authorization.split(' ')[0] !== 'Bearer') {

            return 'AuthorizationNotSet'
        }

        const token = authorization.split(' ')[1];
        if (token == null || token == undefined || token == '') {

            return 'AuthorizationNotSet'
        } else {

            var decodeOldToken;
            var oldAccessToken;
            try {

                decodeOldToken = CryptoJS.AES.decrypt(token, process.env.ACCESS_TOKEN_SECRET_BCRYPT)

                try {

                    oldAccessToken = decodeOldToken.toString(CryptoJS.enc.Utf8)

                } catch (error) {
                    return 'AuthorizationNotSet'
                }
            } catch (error) {
                return 'AuthorizationNotSet'
            }

            await verify(oldAccessToken, fs.readFileSync(process.env.NEW_ACCESS_TOKEN_SECRET_KEY), { algorithms: ['PS384'] }, (tokenError, decodedToken: JwtPayload) => {
                if (tokenError) {

                    return 'AuthorizationNotSet'
                } else {
                    if (decodedToken.exp * 1000 < Date.now()) {
                        return 'AuthorizationNotSet'
                    } else {

                        userId = decodedToken.payload.user;




                    }

                }
            })
        }



        if (true) {
            return await userId
        } else {
            return 'AuthorizationNotSet'
        }
    }


}