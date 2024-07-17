import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from 'src/module/users/user.entity';

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.like)
    user: User;

    @ManyToOne(() => Product, product => product.like)
    product: Product;

    @Column()
    date: Date;

}