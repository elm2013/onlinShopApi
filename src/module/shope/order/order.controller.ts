import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service ';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Order')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('/')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async submitOrder(@Request() req) {
        return await this.orderService.submitOrder(req.user)
    }

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async getAllMyOrder(@Request() req) {
        return await this.orderService.getAllOrder(req.user)

    }

    @Get('/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async getMyOrderWithId(@Request() req, @Param('id') id: string) {
        return await this.orderService.getOrderWithId(req.user, id)
    }
}