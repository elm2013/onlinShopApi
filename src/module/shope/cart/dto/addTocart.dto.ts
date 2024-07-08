import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class addToCartModel {

    @IsNumber()
    @ApiProperty({ required: true })
    product: number;

    @IsNumber()
    @Min(1)
    @ApiProperty({ required: true })
    quantity: number;
}
