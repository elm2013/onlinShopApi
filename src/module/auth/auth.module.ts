import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/user.module';
import { CartModule } from '../shope/cart/cart.module';

@Module({
    imports: [
        UsersModule,
        CartModule,
        PassportModule.register({ defaultStrategy: 'JwtStrategy' }),
        JwtModule.register({
            secret: 'kdjdsfusdhffys',
            signOptions: {
                expiresIn: '2h',
            },

        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule { }
