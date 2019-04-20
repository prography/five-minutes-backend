import { Body, Delete, Get, JsonController, Param, Post, Put, UseInterceptor } from 'routing-controllers';
import { CommentCreateDto } from '../Dto/CommentCreateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { Comment } from '../models/Comment';
import { CommentService } from '../services/CommentService';

@JsonController('/comments')
export class CommentController {

  @Post('/')
  @UseInterceptor(EntityInterceptor)
  create(@Body() comment: CommentCreateDto) {
    return new CommentService().create(
      comment.content,
      comment.codeline,
      comment.question,
      comment.user,
    );
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
