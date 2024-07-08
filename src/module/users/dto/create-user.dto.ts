// import { IsPhoneNumber } from '@nestjs/class-validator';
import { IsPhoneNumber, IsEmail, IsEmpty, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    readonly id: number;

    @IsPhoneNumber('IR')
    @IsNotEmpty()
    @ApiProperty({ required: true })
    mobile: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    password: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    firstName: string;

    @IsString()
    @ApiProperty({ required: false })
    lastName: string;
}
