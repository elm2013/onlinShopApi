import { BadRequestException, Injectable } from "@nestjs/common";
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

    async requestTransactionfromWallet(data: RequestTransactionDto, user) {
        let balance = await this.getBalance(user)
        if (balance < data.price) {
            return new BadRequestException("balance is not enough")
        }
        let newTransActionData = {
            user: user,
            amount: data.price,
            gateway: TransactionGetwayEnum.BUY,
            description: "پرداخت سفارش ",
            mode: TransactionModeEnum.DECREASE,
            method: TransactionMethodEnum.WALLET,
            status: TransactionStatusEnum.COMPLETED
        };
        let source = await this.orderRepository.findOne({ where: { id: data.source } })

        let newTransAction = await this.transactionRepository.save(
            this.transactionRepository.create(newTransActionData)
        );
        source.transaction = newTransAction
        await this.orderRepository.save(source)
    }

    async verifyTransaction(request, response) {
        let data;
        let status = request.query.Status
        let authority = request.query.Authority
        let transaction = await this.transactionRepository.findOneBy({ authority: authority });


        if (!transaction) {
            let verifyTransactionData = await {
                res: await authority,
                type: await '',
                date: await new Date().toLocaleDateString('fa'),
                time: await new Date().toLocaleTimeString('fa'),
                amount: await transaction.amount,
                btnUrl: await `https://example.iran.liara.run/api/v1/transactionDone?status=canceled`
            }

            return await response.render('failed', verifyTransactionData);
        }
        else {
            if (status == 'OK') {
                let isVerifyTransactionSuccess = null;

                let req_data = {
                    "merchant_id": process.env.MERCHANTID,
                    "amount": transaction.amount,
                    "authority": authority
                }

                var config = {
                    method: await 'post',
                    url: await 'https://api.zarinpal.com/pg/v4/payment/verify.json',
                    data: await req_data,
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json'"
                    }
                };

                await axios(config)
                    .then(async (response) => {
                        if (response.data.errors.length == 0) {
                            data = response.data.data
                            isVerifyTransactionSuccess = await true
                        } else {
                            isVerifyTransactionSuccess = await false
                        }
                    })
                    .catch(err => (console.log(err)
                    ))

                if (isVerifyTransactionSuccess == true) {
                    transaction.traceNo = data.ref_id
                    transaction.status = TransactionStatusEnum.COMPLETED

                    transaction = await this.transactionRepository.save(transaction);





                    let verifyTransactionData = await {
                        res: await authority,
                        type: await 'پرداخت صورت حساب',
                        date: await new Date(String(transaction.createDate)).toLocaleDateString('fa'),
                        time: await new Date(String(transaction.createDate)).toLocaleTimeString('fa'),
                        amount: await transaction.amount,
                        btnUrl: await `https://example.iran.liara.run/api/v1/transactionDone?status=succeed`
                    }


                    // let title = 'تایید تراکنش'
                    // let description = 'تراکنش تایید شد'
                    // NotifMessageService.sendNotif(title, description, await transaction.user)

                    return await response.render('successful', verifyTransactionData);
                }
                else if (isVerifyTransactionSuccess == false) {

                    let verifyTransactionData = await {
                        res: await authority,
                        type: await '',
                        date: await new Date().toLocaleDateString('fa'),
                        time: await new Date().toLocaleTimeString('fa'),
                        amount: await transaction.amount,
                        btnUrl: await `https://example.iran.liara.run/api/v1/transactionDone?status=canceled`
                    }

                    return await response.render('failed', verifyTransactionData);
                }


            } else {

                let verifyTransactionData = await {
                    res: await authority,
                    type: await '',
                    date: await new Date().toLocaleDateString('fa'),
                    time: await new Date().toLocaleTimeString('fa'),
                    amount: await transaction.amount,
                    btnUrl: await `https://example.iran.liara.run/api/v1/transactionDone?status=canceled`
                }
                return await response.render('failed', verifyTransactionData);
            }

        }

    }

    async getBalance(user: any) {
        let balance = 0
        let listTransaction = await this.transactionRepository.find({ where: { user: user.id, status: TransactionStatusEnum.COMPLETED } })
        for (const iterator of listTransaction) {
            //if type of pay  is add to wallet  balance += amount
            if (iterator.gateway == TransactionGetwayEnum.WALLET) {
                balance += iterator.amount
            }
            else { //if type of pay  is buy  and  paid from wallet balance -=amount
                if (iterator.method == TransactionMethodEnum.WALLET) {
                    balance -= iterator.amount
                }
            }
        }
        return balance
    }






} 