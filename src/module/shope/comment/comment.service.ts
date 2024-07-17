import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../product/product.entity";
import { IsNull, Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { CommentModelDto } from "./dto/submitComment.dto";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,

    ) { }

    async submitComment(data: CommentModelDto) {
        // if (!data.product || !data.name || !data.description) {
        //     return new BadRequestException("Invalid request data.");
        // }

        let product = await this.productRepository.findOneBy({ id: data.product })
        if (!product) {
            return new BadRequestException("this product not exist.")
        }
        let parentComment: Comment | null
        if (data.parentComment) {

            parentComment = await this.commentRepository.findOneBy({ id: data.parentComment })
            if (!parentComment) {
                return new BadRequestException('Parent comment not found.');
            }


        }
        const comment = this.commentRepository.create({
            product: product,
            parentComment: parentComment,
            name: data.name,
            description: data.description,
            date: new Date(),
            replies: [],
        });

        await this.commentRepository.save(comment);

    }

    async getCommentOfProduct(productId) {
        const product = await this.productRepository.findOneBy({ id: productId })
        if (!product) {
            return new BadRequestException("this product not exist.")
        }
        return await this.commentRepository.find({ where: { parentComment: IsNull(), product: { id: productId } }, relations: { replies: true } });
    }

    async getCommentById(id: number) {
        return this.commentRepository.findOne({ where: { id: id, }, relations: { replies: true } })

    }

}