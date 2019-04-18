import { Body, Controller, Delete, Get, Param, Post, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { Tag } from '../models/Tag';

@Controller('/tags')
export class TagController {

  @Post('/')
  @UseInterceptor(EntityInterceptor)
  create(@Body() tag: Tag) {
    return tag;
  }

  @Get('/')
  @UseInterceptor(PaginationInterceptor)
  getTags() {
    return {
      items: [],
      page: 1,
      perPage: 10,
      totalCount: 100,
      count: 10,
    };
  }

  @Get('/:id')
  @UseInterceptor(EntityInterceptor)
  getTag(@Param('id') id: number) {
    return { id };
  }

  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  deleteTag(@Param('id') id: number) {
    return `delete item number ${id}`;
  }

}
