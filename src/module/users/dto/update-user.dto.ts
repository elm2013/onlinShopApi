// import { IsPhoneNumber } from '@nestjs/class-validator';
import { IsPhoneNumber, IsEmail, IsEmpty, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
    readonly id: number;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: false })
    firstName: string;

    @IsString()
    @ApiProperty({ required: false })
    lastName: string;
}
