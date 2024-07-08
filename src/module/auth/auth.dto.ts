import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class AuthModel {
    @IsPhoneNumber('IR')
    @ApiProperty({ required: true })
    mobile: string;

    @IsString()
    @ApiProperty({ required: true })
    password: string;
}
