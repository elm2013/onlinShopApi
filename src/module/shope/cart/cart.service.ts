import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { User } from 'src/module/users/user.entity';
import { CartItem } from './entity/cartItem.entity';
import { addToCartModel } from './dto/addTocart.dto';
import { ProductsService } from '../product/product.service';
import { InvalidDataException } from 'src/shared/exceptions/422.exception';

@Injectable()
export class CartService {

    constructor(
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>,
        private readonly productsService: ProductsService
    ) { }

    async getOrCreateCart(user: User) {
        let cart
        cart = await this.cartRepository.findOne({
            where: { user: user }, relations: {
                items: {
                    product: true
                }
            }
        })
        if (!cart) {
            await this.cartRepository.save(
                this.cartRepository.create({ user: user, items: [] })
            )
            cart = await this.cartRepository.findOne({
                where: { user: user }, relations: {
                    items: {
                        product: true
                    }
                }
            })

        }


        return cart

    }

    async addToCart(data: addToCartModel, user: User) {

        try {
            let cart = await this.getOrCreateCart(user)

            let product = await this.productsService.simplefindOne(data.product)

            if (!product) {
                return new InvalidDataException({ message: 'Not product wit id', field: 'product' })

            }
            if (product.inventory < data.quantity) {
                return new InvalidDataException({ message: 'Not enough inventory', field: 'inventory' })

            }

            let cartItem = await this.cartItemRepository.findOne({
                where: { product: product, cart: { id: cart.id } }, relations: {
                    product: true
                }
            })
            if (cartItem) {
                console.log("cartItem exist");
                cartItem.quantity += data.quantity
                await this.cartItemRepository.save(cartItem)
            } else {
                console.log("cartItem dos not exist");
                await this.cartItemRepository.save(
                    this.cartItemRepository.create({ cart: cart, product: product, quantity: data.quantity })
                )
            }
            return await this.getOrCreateCart(user)
        } catch (error) {

            console.log(error);

        }
    }
    async removefromCart(data: addToCartModel, user: User) {
        let cart = await this.getOrCreateCart(user)
        let product = await this.productsService.simplefindOne(data.product)

        if (!product) {
            return new InvalidDataException({ message: 'Not product wit id', field: 'product' })

        }

        let cartItem = await this.cartItemRepository.findOne({
            where: { product: product, cart: { id: cart.id } }, relations: {
                product: true
            }
        })
        if (cartItem) {
            console.log("cartItem exist");
            if (cartItem.quantity - data.quantity <= 0) {
                await this.cartItemRepository.delete({
                    product: product, cart: { id: cart.id }
                })
                return
            } else {
                cartItem.quantity -= data.quantity

                return await this.cartItemRepository.save(cartItem)
            }

        }
        return await this.getOrCreateCart(user)
    }

    async deleteCartItem(id: number, user: User) {
        let cart = await this.getOrCreateCart(user)



        await this.cartItemRepository.delete({
            id: id, cart: { id: cart.id }
        })
        return await this.getOrCreateCart(user)
    }


}
