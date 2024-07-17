import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    ValidationPipe,
    UnprocessableEntityException,
    Param,
    NotFoundException,
    Request,
    UseGuards,
} from '@nestjs/common';
import { User as UserEntity } from './user.entity';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ConflictException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }



    @Post('/create')
    @ApiOperation({ summary: 'create user' })
    async store(@Body() user: CreateUserDto,
    ): Promise<UserEntity> {
        const mobileExists = await this.userService.findByPhone(user.mobile);

        if (mobileExists) {
            // throw new UnprocessableEntityException();
            throw new ConflictException('Mobile number already exists');
        }

        return this.userService.create(user);
    }

    @Put('/update')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async update(

        @Body(new ValidationPipe()) user: UpdateUserDto, @Request() req,

    )
        : Promise<UpdateResult> {
        const userEntity = await this.userService.findById(req.user.id);

        if (!userEntity) {
            throw new NotFoundException();
        }

        return await this.userService.update(userEntity.id, user)

    }

    @Get('/profile')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async show(@Request() req): Promise<UserEntity> {
        const user = this.userService.findById(req.user.id);

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }
}
