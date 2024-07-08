import { User } from "src/module/users/user.entity";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings";
import { OrderItem } from "./orderItem.entity";
import { Transaction } from "../../transaction/transaction.entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User

    @Column({ default: new Date().toISOString() })
    createDate: Date

    @Column()
    status: string

    @Column()
    postTracking: string

    @OneToMany(() => OrderItem, items => items.order)
    @JoinColumn()
    items: OrderItem[]

    @OneToOne(() => Transaction)
    @JoinColumn()
    transaction: Transaction

    public totalPrice: number;

    @AfterLoad()
    generateTotalPrice(): void {
        this.totalPrice = this.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    }


}