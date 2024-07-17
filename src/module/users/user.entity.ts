import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Order } from '../shope/order/entity/order.entity';
import { Like } from '../shope/like/like.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({
        unique: true,
    })
    mobile: string;

    @Column()
    birthDate: string

    @Column()
    status: string

    @Column()
    role: string

    @Column({
        select: false,
    })
    password: string;

    @OneToMany(() => Order, order => order.user, { onDelete: 'CASCADE' })
    @JoinColumn()
    orders: Order[]

    @OneToMany(() => Like, like => like.user)
    like: Like[];

}