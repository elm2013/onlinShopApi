import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './module/users/user.module'
import { ProductModule } from './module/shope/product/product.module';
import { CategoryModule } from './module/shope/category/category.module';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './module/shope/comment/comment.module';
import { LikeModule } from './module/shope/like/like.module';
import { CartModule } from './module/shope/cart/cart.module';
import { AuthModule } from './module/auth/auth.module';
import { OrderModule } from './module/shope/order/order.module';
import { TransactionModule } from './module/shope/transaction/transaction.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjd_orm',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true

    }),
    AuthModule,
    UsersModule,
    ProductModule,
    CategoryModule,
    CommentModule,
    LikeModule,
    CartModule,
    OrderModule,
    TransactionModule
  ],
})
export class AppModule { }