import { Authorized, Body, BodyParam, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParam, UseInterceptor } from 'routing-controllers';
import { CommentCreateDto } from '../Dto/CommentCreateDto';
import { QuestionCreateDto } from '../Dto/QuestionCreateDto';
import { QuestionUpdateDto } from '../Dto/QuestionUpdateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { QuestionInterceptor } from '../interceptors/QuestionInterceptor';
import { QuestionPaginationInterceptor } from '../interceptors/QuestionPaginationInterceptor';
import { QuestionStatus } from '../models/Question';
import { User } from '../models/User';
import { CommentService } from '../services/CommentService';
import { QuestionService } from '../services/QuestionService';
import { TagService } from '../services/TagService';

@JsonController('/questions')
export class QuestionController  {

  @Authorized()
  @Post()
  @UseInterceptor(EntityInterceptor)
  async create(@CurrentUser({ required: true }) user: User, @Body() question: QuestionCreateDto) {
    const tags = await new TagService().getOrCreateByNames(question.tags);
    const newQuestion = await new QuestionService().create(
      user,
      question.subject,
      question.content,
      question.code,
      question.language,
      tags,
    );
    return {
      ...newQuestion,
      likedUsers: newQuestion.likedUsers || [],
      dislikedUsers: newQuestion.dislikedUsers || [],
    };
  }

  @Get()
  @Get('/search')
  @UseInterceptor(QuestionPaginationInterceptor)
  @UseInterceptor(PaginationInterceptor)
  async getQuestions(
    @QueryParam('page', { required: true }) page: number,
    @QueryParam('perPage', { required: true }) perPage: number,
    @QueryParam('lastId') lastId?: number,
    @QueryParam('subject') subject?: string,
    @QueryParam('language') language?: string,
    @QueryParam('tags') tagNames?: string[],
  ) {
    const tags = await new TagService().getOrCreateByNames(tagNames || []);
    const [items, totalCount] = await new QuestionService()
      .getQuestions(perPage, (page - 1) * perPage, { lastId, subject, language, tags });
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
  @UseInterceptor(QuestionInterceptor)
  getQuestion(@Param('id') id: number) {
    return new QuestionService().getQuestionById(id);
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

  @Authorized()
  @Put('/:id/comments/:commentId/correct')
  @UseInterceptor(EntityInterceptor)
  correctCodeByComment(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
    @BodyParam('code', { required: true }) code: string,
  ) {
    return new QuestionService().correctQuestion(id, code, commentId);
  }

  @Authorized()
  @Put('/:id/status/resolve')
  @UseInterceptor(EntityInterceptor)
  changeStatusToResolve(@Param('id') id: number) {
    return new QuestionService().updateStatus(id, QuestionStatus.RESOLVE);
  }

  @Authorized()
  @Put('/:id/status/pending')
  @UseInterceptor(EntityInterceptor)
  changeStatusToPending(@Param('id') id: number) {
    return new QuestionService().updateStatus(id, QuestionStatus.PENDING);
  }

  @Authorized()
  @Put('/:id/like')
  @UseInterceptor(EntityInterceptor)
  likeQuestion(@Param('id') id: number, @CurrentUser({ required: true }) user: User) {
    return new QuestionService().like(id, user);
  }

  @Authorized()
  @Put('/:id/dislike')
  @UseInterceptor(EntityInterceptor)
  dislikeQuestion(@Param('id') id: number, @CurrentUser({ required: true }) user: User) {
    return new QuestionService().dislike(id, user);
  }

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
  async createComment(@CurrentUser() user: User, @Param('id') questionId: number, @Body() comment: CommentCreateDto) {
    const newComment = await new CommentService().create(
      user,
      comment.content,
      comment.codeline,
      questionId,
    );
    return {
      ...newComment,
      likedUsers: newComment.likedUsers || [],
      dislikedUsers: newComment.dislikedUsers || [],
    };
  }

  @Authorized()
  @Put('/:id/tags/add')
  @UseInterceptor(EntityInterceptor)
  async addTag(@Param('id') id: number, @BodyParam('tag') name: string) {
    const tag = await new TagService().getOrCreateByNames([name]);
    return new QuestionService().addTag(tag[0], id);
  }

  @Authorized()
  @Put('/:id/tags/remove')
  @UseInterceptor(EntityInterceptor)
  async removeTag(@Param('id') id: number, @BodyParam('tag') name: string) {
    const tag = await new TagService().getOrCreateByNames([name]);
    return new QuestionService().removeTag(tag[0], id);
  }

}
