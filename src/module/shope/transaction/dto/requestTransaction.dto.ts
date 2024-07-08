// import { IsPhoneNumber } from '@nestjs/class-validator';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionGetwayEnum } from '../enums/getway.enum';
export class RequestTransactionDto {

    @IsNotEmpty()
    @ApiProperty({ required: true })
    price: number;

    @IsNotEmpty()
    @IsString()
    @IsEnum(TransactionGetwayEnum)
    @ApiProperty({ required: true })
    gateway: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ required: true })
    source: string;

}
