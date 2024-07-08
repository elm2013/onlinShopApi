import { Controller, Post, Body, ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { AuthModel } from './auth.dto';
import { AuthService } from './auth.service';
import { UserService } from './../users/users.service';
import { CreateUserDto as UserModel } from './../users/dto/create-user.dto';
import { CartService } from '../shope/cart/cart.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly cartService: CartService
    ) { }

    @Post('/login')
    async login(@Body(new ValidationPipe()) auth: AuthModel) {
        let result = await this.authService.authenticate(auth);
        if (result.user) {
            await this.cartService.getOrCreateCart(result.user);
        }
        return result

    }

    @Post('/register')
    async register(@Body(new ValidationPipe()) userModel: UserModel) {
        const mobileExists = await this.userService.findByPhone(userModel.mobile);

        if (mobileExists) {
            throw new UnprocessableEntityException();
        }

        const user = await this.userService.create(userModel);
        await this.cartService.getOrCreateCart(user);

        return this.authService.createToken(user);
    }
}
