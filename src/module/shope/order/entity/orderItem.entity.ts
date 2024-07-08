import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../product/product.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, { onDelete: 'CASCADE' })
    @JoinColumn()
    order: Order;


    @ManyToOne(() => Product) // Define the relation
    @JoinColumn()
    product: Product;

    @Column()
    quantity: number;

    @Column()
    unitPrice: number

}