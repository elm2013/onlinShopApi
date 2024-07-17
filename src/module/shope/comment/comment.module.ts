import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { commentController } from './comment.controller';
import { CommentService } from './comment.service';
import { ProductModule } from '../product/product.module';


@Module({
    imports:
        [TypeOrmModule.forFeature([Comment]),
            ProductModule],
    controllers: [commentController],
    providers: [CommentService]

})
export class CommentModule { }