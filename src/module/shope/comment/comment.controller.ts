import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommentModelDto } from "./dto/submitComment.dto";
import { CommentService } from "./comment.service";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('Comment')
@Controller('comment')
export class commentController {
    constructor(
        private readonly commentService: CommentService
    ) { }


    @Post('v1/submit')
    async submitComment(@Body() data: CommentModelDto) {

        return await this.commentService.submitComment(data)
    }

    @Get('v1/get-all-comment-product/:id')
    async getCommentOfProduct(@Param('id') id: number) {
        return await this.commentService.getCommentOfProduct(id)
    }

    @Get('v1/get-comment-by-id/:id')
    async getCommentById(@Param('id') id: number) {
        return await this.commentService.getCommentById(id)
    }

}