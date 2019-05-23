import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Put, UseInterceptor } from 'routing-controllers';
import { CommentUpdateDto } from '../Dto/CommentUpdateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { User } from '../models/User';
import { CommentService } from '../services/CommentService';

@JsonController('/comments')
export class CommentController {

  @Get('/:id')
  @UseInterceptor(EntityInterceptor)
  getComment(@Param('id') id: number) {
    return new CommentService().getCommentsByQuestionId(id);
  }

  @Authorized()
  @Put('/:id/like')
  @UseInterceptor(EntityInterceptor)
  likeComment(@Param('id') id: number, @CurrentUser({ required: true }) user: User) {
    return new CommentService().like(id, user);
  }

  @Authorized()
  @Put('/:id/dislike')
  @UseInterceptor(EntityInterceptor)
  dislikeComment(@Param('id') id: number, @CurrentUser({ required: true }) user: User) {
    return new CommentService().dislike(id, user);
  }

  @Authorized()
  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  updateComment(@Param('id') id: number, @Body() comment: CommentUpdateDto) {
    return new CommentService().update(id, comment);
  }

  @Authorized()
  @Put('/:id/resolve')
  @UseInterceptor(EntityInterceptor)
  resolveComment(@Param('id') id: number, @CurrentUser({ required: true }) user: User) {
    return new CommentService().resolve(id, user);
  }

  @Authorized()
  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  deleteComment(@Param('id') id: number) {
    return new CommentService().delete(id);
  }

}
