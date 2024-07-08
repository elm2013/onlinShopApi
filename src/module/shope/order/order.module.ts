import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';
import { OrderService } from './order.service ';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from 'src/module/users/user.module';
import { OrderController } from './order.controller';




@Module({
    imports: [
        TypeOrmModule.forFeature([Order]),
        TypeOrmModule.forFeature([OrderItem]),
        CartModule,
        UsersModule,

    ],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService, TypeOrmModule.forFeature([Order]), TypeOrmModule.forFeature([OrderItem])]
})
export class OrderModule { }