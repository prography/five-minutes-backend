import { Body, Delete, Get, JsonController, Param, Put, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { Comment } from '../models/Comment';
import { CommentService } from '../services/CommentService';

@JsonController('/comments')
export class CommentController {

  @Get('/:id')
  @UseInterceptor(EntityInterceptor)
  getComment(@Param('id') id: number) {
    return new CommentService().getCommentsByQuestionId(id);
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
    return new CommentService().update(id, comment);
  }

  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  deleteComment(@Param('id') id: number) {
    return new CommentService().delete(id);
  }

}
