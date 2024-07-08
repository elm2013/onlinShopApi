import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from '../category/category.entity';
import { Comment } from '../comment/comment.entity';
import { Like } from '../like/like.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column({ default: true })
    description: boolean;

    @Column()
    unitPrice: number

    @Column()
    inventory: number

    @Column({ default: new Date().toISOString() })
    last_update: Date

    @Column()
    isShow: boolean

    @ManyToOne(type => Category, { onDelete: 'SET NULL' })
    @JoinColumn() // this decorator is optional for @ManyToOne, but required for @OneToOne
    collection: Category;

    @OneToMany(() => Comment, comment => comment.product)
    comments: Comment[];

    @OneToMany(() => Like, like => like.product)
    like: Like[];

}