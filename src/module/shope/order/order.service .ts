import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../cart/entity/cart.entity';
import { CartItem } from '../cart/entity/cartItem.entity';
import { User } from 'src/module/users/user.entity';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/orderItem.entity';
import { InvalidDataException } from 'src/shared/exceptions/422.exception';

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,
        // @InjectRepository(Address)
        // private readonly addressRepository: Repository<Address>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) { }

    async submitOrder(user: User) {
        // Using transactions is not supported in TypeORM, you will have to handle it manually
        user = await this.userRepository.findOneBy({ id: user.id })
        const cart = await this.cartRepository.findOne({ where: { user: { id: user.id } }, relations: { items: { product: true } } });
        if (!cart) {
            return new InvalidDataException({ message: 'No cart with the given ID was found.', feild: "" });
        }
        const cartItemsCount = await this.cartItemRepository.count({ where: { cart: { id: cart.id } } });

        if (cartItemsCount === 0) {
            return new InvalidDataException({ message: 'The cart is empty.' });
        }

        // const selectedAddress = await this.addressRepository.findOne({ account: context.user_id, isActive: true });
        // if (!selectedAddress) {
        //     throw new Error('Please select your address before submitting the order.');
        // }


        const order = this.orderRepository.create({ user: user, items: [] });
        await this.orderRepository.save(order);

        const cartItems = await this.cartItemRepository.find({ where: { cart: { id: cart.id } }, relations: { product: true } });
        const orderItems = cartItems.map(item => {
            return this.orderItemRepository.create({
                order: order,
                product: item.product,
                unitPrice: item.product.unitPrice,
                quantity: item.quantity,
            });
        });
        await this.orderItemRepository.save(orderItems);

        await this.cartRepository.delete({ id: cart.id });


        return this.orderRepository.findOne({
            where: { id: order.id }, relations: {
                items: {
                    product: true
                }
            }
        });
    }

    async getOrderWithId(user: User, id: string) {
        return this.orderRepository.findOneOrFail({
            where: { id: id, user: { id: user.id } }, relations: {
                items: {
                    product: true
                }
            }
        })

    }
    async getAllOrder(user: any) {
        return this.orderRepository.find({
            where: { user: { id: user.id } }, relations: {
                items: {
                    product: true
                }
            }
        })
    }
}






