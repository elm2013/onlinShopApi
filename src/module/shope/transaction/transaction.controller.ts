import { Body, Controller, Get, HttpCode, Post, Query, Request, Response, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { RequestTransactionDto } from "./dto/requestTransaction.dto";
import { AuthGuard } from "@nestjs/passport";
import { TransactionService } from "./transaction.service";

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {

    constructor(
        private readonly requestTransactionService: TransactionService
    ) { }

    @Post('v1/request-transaction')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async requestTransaction(
        @Body() body: RequestTransactionDto,
        @Request() req,

    ) {
        return await this.requestTransactionService.requestTransaction(body, req.user);
    }

    @Get('v1/send-transaction')
    @ApiQuery({
        name: 'token',
        type: String,
        required: true,
        description: 'token of payment',
    })
    async sendTransaction(
        @Query('token') token: string,
        @Request() request,
        @Response() response: Response
    ) {
        return await this.requestTransactionService.sendTransaction(token, response);
    }

    @Post('v1/request-transaction-from-wallet')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async requestTransactionFromWallet(
        @Body() body: RequestTransactionDto,
        @Request() req,

    ) {
        return await this.requestTransactionService.requestTransactionfromWallet(body, req.user);
    }


    @Post('v1/verify-request')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    async VerifyrequestTransaction(
        @Request() request,
        @Response() response

    ) {
        return await this.requestTransactionService.verifyTransaction(request, response);
    }

}