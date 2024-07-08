import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { OrderModule } from '../order/order.module';


@Module({
    imports: [TypeOrmModule.forFeature([Transaction]),
        OrderModule],
    providers: [TransactionService],
    controllers: [TransactionController],
    exports: [TypeOrmModule.forFeature([Transaction])]
})
export class TransactionModule { }