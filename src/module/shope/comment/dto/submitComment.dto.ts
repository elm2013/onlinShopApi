// import { IsPhoneNumber } from '@nestjs/class-validator';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentModelDto {

    @ApiProperty({ required: true })
    @IsNotEmpty()
    product: number

    @ApiProperty({ required: false })
    @IsOptional()
    parentComment: number

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    description: string




}
