import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, AfterLoad, AfterInsert, AfterUpdate } from 'typeorm';
import { Product } from '../../product/product.entity';
import { Cart } from './cart.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
    @JoinColumn()
    cart: Cart;

    @ManyToOne(() => Product) // Define the relation
    @JoinColumn()
    product: Product;

    @Column()
    quantity: number;

    // @Column({ readonly: true })
    public totalPrice: number;

    @AfterLoad()
    // @AfterInsert()
    // @AfterUpdate()
    generateTotalPrice(): void {
        this.totalPrice = this.quantity * this.product.unitPrice;


    }

}