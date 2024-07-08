import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { Product } from './product.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
@ApiTags('product')
@Controller('product')
export class ProductsController {
    constructor(private readonly usersService: ProductsService) { }

    // @Post()
    // create(@Body() createUserDto: CreateUserDto): Promise<User> {
    //     return this.usersService.create(createUserDto);
    // }
    @Get('/search')
    @ApiOperation({ summary: 'search  on product .' })
    @ApiQuery({
        name: 'searchText',
        type: String,
        required: false,
        description: 'search on title',
    })
    @ApiQuery({
        name: 'pageNumber',
        type: Number,
        required: false,
        description: 'Page number ',
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Limit item in each page ',
    })
    async searchProduct(
        @Query('searchText') searchText: any,
        @Query('pageNumber') pageNumber: number,
        @Query('limit') limit: number,
    ) {
        pageNumber = (pageNumber && pageNumber > 0) ? pageNumber : 1;
        searchText = searchText ? searchText : '';
        limit = (limit && limit > 0) ? limit : 20;
        return this.usersService.paginate({ pageNumber, limit, searchText })
    }


    @Get('')
    @ApiOperation({ summary: 'Get all product .' })
    findAll(): Promise<Product[]> {

        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.usersService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}