import { Body, Controller, Delete, Get, Param, Post, Put } from 'routing-controllers';
import { Comment } from '../models/Comment';

@Controller('/comments')
export class CommentController {

  @Post('/')
  create(@Body() comment: Comment) {
    return {
      result: comment,
    };
  }

  @Get('/')
  getComments() {
    return {
      result: {
        items: [],
      },
    };
  }

  @Get('/:id')
  getComment(@Param('id') id: number) {
    return {
      result: { id },
    };
  }

  @Put('/:id/like')
  likeComment(@Param('id') id: number) {
    return {
      result: { id, like: true },
    };
  }

  @Put('/:id')
  updateComment(@Param('id') id: number, @Body() comment: Comment) {
    return {
      result: { ...comment, id },
    };
  }

  @Delete('/:id')
  deleteComment(@Param('id') id: number) {
    return {
      result: `delete item number ${id}`,
    };
  }

}
