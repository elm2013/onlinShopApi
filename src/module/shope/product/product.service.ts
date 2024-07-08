import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly ProductRepository: Repository<Product>,
    ) { }

    // create(createProductDto: CreateProductDto): Promise<Product> {
    //     const product = new Product();


    //     return this.ProductRepository.save(product);
    // }

    async findAll(): Promise<Product[]> {

        return this.ProductRepository.find({
            order: { title: "DESC" },
            relations: {
                collection: true
            }
        });
    }
    async simplefindOne(id: number): Promise<Product> {
        return await this.ProductRepository.findOne({
            where: { id: id },

        });

    }
    async findOne(id: number): Promise<Product> {
        const product = await this.ProductRepository.findOne({
            where: { id: id },
            relations: {
                comments: true,
                collection: true,
                like: true
            }
        });

        product["likeCount"] = product.like.length;
        delete product['like']
        return product
        // return this.ProductRepository.createQueryBuilder('product')
        //     .where('product.id = :id', { id })
        //     .leftJoinAndSelect('product.like', 'like')
        //     .loadRelationCountAndMap('product.likeCount', 'product.like')
        //     .getOne();

        // ;

    }

    async remove(id: string): Promise<void> {
        await this.ProductRepository.delete(id);
    }

    async paginate(query) {
        const take = query.limit || 10
        const skip = query.pageNumber * take || 0
        const keyword = query.searchText || ''

        const [result, total] = await this.ProductRepository.findAndCount(
            {
                where: { title: Like('%' + keyword + '%') },
                order: { title: "DESC" },
                take: take,
                skip: skip

            }

        );

        return {
            data: result,
            count: total
        }
    }
}