import { Injectable } from "@nestjs/common";
import { Transaction } from "./transaction.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TransactionGetwayEnum } from "./enums/getway.enum";
import { RequestTransactionDto } from "./dto/requestTransaction.dto";
import { TransactionModeEnum } from "./enums/mode.enum";
import { TransactionMethodEnum } from "./enums/method.enum";
import { TransactionStatusEnum } from "./enums/status.enum";
import { Order } from "../order/entity/order.entity";
import axios from 'axios';
@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,

    ) { }

    async requestTransaction(data: RequestTransactionDto, user) {
        let description = ""
        let mode = ""
        let newTransActionData = {
            user: user,
            amount: data.price,
            gateway: data.gateway,
            description: description,
            mode: mode,
            method: TransactionMethodEnum.ONLINE,
            status: TransactionStatusEnum.PENDING
        };
        let source
        switch (data.gateway) {
            case TransactionGetwayEnum.WALLET:
                description = 'افزایش موجودی کیف پول'
                mode = TransactionModeEnum.ADDITIVE
                break;
            case TransactionGetwayEnum.BUY:
                description = "پرداخت سفارش "
                mode = TransactionModeEnum.DECREASE
                source = await this.orderRepository.findOne({ where: { id: data.source } })
                break;
            default:
                newTransActionData.description = description
                newTransActionData.mode = mode

        }

        let newTransAction = await this.transactionRepository.save(
            this.transactionRepository.create(newTransActionData)
        );
        source.transaction = newTransAction
        source.save()
        let axiosData = {
            merchant_id: process.env.MERCHANTID,
            currency: "IRT",
            amount: await newTransAction.amount,
            callback_url: await process.env.REDIRECTURL,
            description: await newTransAction.description,

        }

        let req_header = {
            "accept": "application/json",
            "content-type": "application/json"
        }

        var config = await {
            method: await 'post',
            url: await 'https://api.zarinpal.com/pg/v4/payment/request.json',
            data: await axiosData,
            headers: await req_header
        };

        await axios(config)
            .then(async (response) => {
                if (response.data.errors.length == 0) {
                    await this.transactionRepository.update(newTransAction.id, { authority: response.data.data.authority });
                    // authority=authority
                    return { token: response.data.data.authority }
                }
                else {
                    console.log("error is: ", response.data.errors);
                    // return (response, { status: 500, success: false, message: response.data.errors.message, })
                }
            })

    }

    async sendTransaction(token, response) {
        let authority = token

        return response.redirect(301, `https://www.zarinpal.com/pg/StartPay/${authority}`);

        // let sendTransactionData = await {
        //     token: token
        // }

        // return await response.render('sendPayment', sendTransactionData);
    }
} 