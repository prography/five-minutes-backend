import { Authorized, Body, Delete, Get, JsonController, Param, Put, QueryParam, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { CommentService } from '../services/CommentService';
import { QuestionService } from '../services/QuestionService';
import { UserService } from '../services/UserService';
import { UserUpdateDto } from './../Dto/UserUpdateDto';

@JsonController('/users')
export class UserController {

  @Get('/')
  @UseInterceptor(PaginationInterceptor)
  async getUsers(
    @QueryParam('page', { required: true }) page: number,
    @QueryParam('perPage', { required: true }) perPage: number,
  ) {
    const [items, totalCount] = await new UserService().getUsers(perPage, (page - 1) * perPage);
    return {
      items,
      totalCount,
      page,
      perPage,
      count: items.length,
    };
  }

  @Get('/:id')
  @UseInterceptor(EntityInterceptor)
  getUser(@Param('id') id: number) {
    return new UserService().getUserById(id);
  }

  @Authorized()
  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  updateUser(@Param('id') id: number, @Body() user: UserUpdateDto) {
    return new UserService().update(id, user);
  }

  @Authorized()
  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  async deleteUser(@Param('id') id: number) {
    await new UserService().delete(id);
    return `delete item number ${id}`;
  }

  @Get('/:id/questions')
  @UseInterceptor(PaginationInterceptor)
  async getQuestionsByUser(@Param('id') id: number) {
    const user = await new UserService().getUserById(id);
    if (!user) throw Error('NO_DOES_NOT_EXIST');
    const [items, totalCount] = await new QuestionService().getQuestionsByUser(user);
    return {
      items,
      totalCount,
    };
  }

  @Get('/:id/comments')
  @UseInterceptor(PaginationInterceptor)
  async getCommentsByUser(@Param('id') id: number) {
    const user = await new UserService().getUserById(id);
    if (!user) throw Error('NO_DOES_NOT_EXIST');
    const [items, totalCount] = await new CommentService().getCommentsByUser(user);
    return {
      items,
      totalCount,
    };
  }

  @Get('/:id/liked-questions')
  @UseInterceptor(PaginationInterceptor)
async getLikedQuestionsByUser(@Param('id') id: number) {
    const user = await new UserService().getUserById(id);
    if (!user) throw Error('NO_DOES_NOT_EXIST');
    const [items, totalCount] = await new QuestionService().getQuestionsByLikedUser(user);
    return {
      items,
      totalCount,
    };
  }

  @Get('/:id/liked-comments')
  @UseInterceptor(PaginationInterceptor)
  async getLikedCommentsByUser(@Param('id') id: number) {
    const user = await new UserService().getUserById(id);
    if (!user) throw Error('NO_DOES_NOT_EXIST');
    const [items, totalCount] = await new CommentService().getCommentsByLikedUser(user);
    return {
      items,
      totalCount,
    };
  }

}
