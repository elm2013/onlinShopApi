import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from './../users/users.service';
import { User as UserEntity } from './../users/user.entity';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { AuthModel } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(payload: JwtPayloadInterface): Promise<UserEntity | null> {
        return await this.userService.findById(payload.id);
    }

    async authenticate(auth: AuthModel) {
        const user = await this.userService.findByPhoneWithPassword(auth.mobile);


        if (!user) {
            throw new BadRequestException();
        }

        if (!this.userService.compareHash(auth.password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }
        return this.createToken(user)

    }

    async createToken(user) {
        let accessTokenOptions: any = {
            expiresIn: '12h',
            // accessTokenExpireTime,             
            algorithm: 'HS256',
            secret: 'kdjdsfusdhffys'
        };
        let payload = { id: user.id }

        const token = await this.jwtService.signAsync(payload, accessTokenOptions);

        return { user, token }
    }
}
