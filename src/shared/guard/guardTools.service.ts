import { Injectable } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UnAuthenticationException } from './../exceptions/401.exception';

var fs = require('fs');
var CryptoJS = require("crypto-js");


@Injectable()
export class GuardToolsService {

    constructor(


    ) { }

    async validateRequest(authorization: String) {

        let userId = null

        if (authorization.split(' ')[0] !== 'Bearer') {
            throw new UnAuthenticationException("توکن وارد شده نامعتبر می باشد.")
        }

        const token = authorization.split(' ')[1];
        if (token == null || token == undefined || token == '') {
            throw new UnAuthenticationException("توکن وارد شده نامعتبر می باشد.")
        } else {

            var decodeOldToken;
            var oldAccessToken;
            try {

                decodeOldToken = CryptoJS.AES.decrypt(token, process.env.ACCESS_TOKEN_SECRET_BCRYPT)

                try {

                    oldAccessToken = decodeOldToken.toString(CryptoJS.enc.Utf8)

                } catch (error) {
                    throw new UnAuthenticationException("توکن وارد شده نامعتبر می باشد.")
                }
            } catch (error) {
                throw new UnAuthenticationException("توکن وارد شده نامعتبر می باشد.")
            }

            await verify(oldAccessToken, fs.readFileSync(process.env.NEW_ACCESS_TOKEN_SECRET_KEY), { algorithms: ['PS384'] }, (tokenError, decodedToken: JwtPayload) => {

                if (tokenError) {
                    if (tokenError.name == 'TokenExpiredError') {
                        throw new UnAuthenticationException("توکن وارد شده منقضی شده است..")
                    } else {
                        throw new UnAuthenticationException("توکن وارد شده نامعتبر می باشد.")
                    }
                } else {
                    if (decodedToken.exp * 1000 < Date.now()) {
                        throw new UnAuthenticationException("توکن وارد شده منقضی شده است..")
                    } else {

                        userId = decodedToken.payload.user;



                    }

                }
            })
        }



        if (true) {
            return await userId
        } else {
            throw new UnAuthenticationException("توکن وارد شده نامعتبر می باشد.")
        }




    }


}