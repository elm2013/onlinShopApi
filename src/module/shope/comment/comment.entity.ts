import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.comments)
    product: Product;

    @OneToMany(type => Comment, comment => comment.parentComment,)
    replies: Comment[];

    @ManyToOne(type => Comment, comment => comment.replies, { nullable: true })
    parentComment: Comment;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    date: Date;

}


