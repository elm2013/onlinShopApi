import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.comments)
    product: Product;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    date: Date;

}



// Need to add logic for GenericForeignKey equivalent in TypeORM