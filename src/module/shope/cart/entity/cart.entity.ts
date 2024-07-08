import { User } from 'src/module/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, AfterLoad, AfterInsert, AfterUpdate } from 'typeorm';
import { CartItem } from './cartItem.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;


    @OneToMany(() => CartItem, items => items.cart)
    @JoinColumn()
    items: CartItem[]

    @Column({ default: new Date().toISOString() })
    createDate: Date


    public totalPrice: number;

    @AfterLoad()
    generateTotalPrice(): void {
        this.totalPrice = this.items.reduce((acc, item) => acc + item.totalPrice, 0);

    }



}