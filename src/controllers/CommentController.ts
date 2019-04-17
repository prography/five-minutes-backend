import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { Comment } from '../models/Comment';

@Controller('/comments')
export class CommentController {

  @Post('/')
  @UseInterceptor(EntityInterceptor)
  create(@Body() comment: Comment) {
    return comment;
  }

  @Get('/')
  @UseInterceptor(PaginationInterceptor)
  getComments() {
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
  getComment(@Param('id') id: number) {
    return { id };
  }

  @Put('/:id/like')
  @UseInterceptor(EntityInterceptor)
  likeComment(@Param('id') id: number) {
    return {
      id, like: true,
    };
  }

  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  updateComment(@Param('id') id: number, @Body() comment: Comment) {
    return {
      ...comment, id,
    };
  }

  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  deleteComment(@Param('id') id: number) {
    return `delete item number ${id}`;
  }

}
