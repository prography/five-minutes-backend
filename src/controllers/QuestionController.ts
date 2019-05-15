import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParam, UseInterceptor } from 'routing-controllers';
import { CommentCreateDto } from '../Dto/CommentCreateDto';
import { QuestionCreateDto } from '../Dto/QuestionCreateDto';
import { QuestionUpdateDto } from '../Dto/QuestionUpdateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { User } from '../models/User';
import { CommentService } from '../services/CommentService';
import { QuestionService } from '../services/QuestionService';
import { TagService } from '../services/TagService';

@JsonController('/questions')
export class QuestionController  {

  @Authorized()
  @Post('/')
  @UseInterceptor(EntityInterceptor)
  async create(@CurrentUser({ required: true }) user: User, @Body() question: QuestionCreateDto) {
    const tags = await new TagService().getOrCreateByNames(question.tags);
    return new QuestionService().create(
      user,
      question.subject,
      question.content,
      question.code,
      question.language,
      tags,
    );
  }

  @Get('/')
  @UseInterceptor(PaginationInterceptor)
  async getQuestions(
    @QueryParam('page', { required: true }) page: number,
    @QueryParam('perPage', { required: true }) perPage: number,
    @QueryParam('lastId') lastId?: number,
  ) {
    const [items, totalCount] = await new QuestionService().getQuestions(perPage, (page - 1) * perPage, lastId);
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
  getQuestion(@Param('id') id: number) {
    return new QuestionService().getQuestion(id);
  }

  @Get('/:id/comments')
  @UseInterceptor(PaginationInterceptor)
  async getQuestionComments(
    @Param('id') id: number,
  ) {
    const [items, totalCount] = await new CommentService().getCommentsByQuestionId(id);
    return {
      items,
      totalCount,
      page: 1,
      perPage: totalCount,
      count: totalCount,
    };
  }

  // @Put('/:id/like')
  // @UseInterceptor(EntityInterceptor)
  // likeQuestion(@Param('id') id: number, @Body() body: { user: User }) {
  //   return new QuestionService().likeQuestion(body.user, id);
  // }

  @Authorized()
  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  async updateQuestion(@Param('id') id: number, @Body() question: QuestionUpdateDto) {
    const tags = await new TagService().getOrCreateByNames(question.tags);
    return new QuestionService().update(
      id,
      question,
      tags,
    );
  }

  @Authorized()
  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  async deleteQuestion(@Param('id') id: number) {
    await new QuestionService().delete(id);
    return `delete item number ${id}`;
  }

  @Authorized()
  @Post('/:id/comments')
  @UseInterceptor(EntityInterceptor)
  createComment(@CurrentUser() user: User, @Param('id') questionId: number, @Body() comment: CommentCreateDto) {
    return new CommentService().create(
      comment.content,
      comment.codeline,
      questionId,
      user.id,
    );
  }

}
