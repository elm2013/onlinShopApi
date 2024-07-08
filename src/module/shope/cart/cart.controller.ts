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
    Patch,
    Delete,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { ConflictException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { addToCartModel } from './dto/addTocart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }


    @Get('/')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async getMyCart(@Request() req) {
        return this.cartService.getOrCreateCart(req.user)
    }

    @Post('/add')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async addToMyCart(@Request() req, @Body() data: addToCartModel) {
        return this.cartService.addToCart(data, req.user)

    }
    @Patch('/remove')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async removeFromCart(@Request() req, @Body() data: addToCartModel) {
        return this.cartService.removefromCart(data, req.user)

    }
    @Delete('/delete-item/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async deleteItem(@Request() req, @Param('id') id: number) {
        return this.cartService.deleteCartItem(id, req.user)

    }


}