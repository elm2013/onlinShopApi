import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { CartItem } from './entity/cartItem.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ProductModule } from '../product/product.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart]),
        TypeOrmModule.forFeature([CartItem]),
        ProductModule],
    controllers: [CartController],
    providers: [CartService],
    exports: [TypeOrmModule.forFeature([Cart]), TypeOrmModule.forFeature([CartItem]), CartService]

})
export class CartModule { }