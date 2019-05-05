import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParam, UseInterceptor } from 'routing-controllers';
import { QuestionCreateDto } from '../Dto/QuestionCreateDto';
import { QuestionUpdateDto } from '../Dto/QuestionUpdateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { QuestionService } from '../services/QuestionService';
import { TagService } from '../services/TagService';

@JsonController('/questions')
export class QuestionController  {

  @Post('/')
  @UseInterceptor(EntityInterceptor)
  async create(@Body() question: QuestionCreateDto) {
    const tags = await new TagService().getOrCreateByNames(question.tags);
    return new QuestionService().create(
      question.user,
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
  ) {
    const [items, totalCount] = await new QuestionService().getQuestions(perPage, (page - 1) * perPage);
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
  getQuestionComments(@Param('id') _: number) {
    return {
      items: [],
      page: 1,
      perPage: 10,
      totalCount: 100,
      count: 10,
    };
  }

  // @Put('/:id/like')
  // @UseInterceptor(EntityInterceptor)
  // likeQuestion(@Param('id') id: number, @Body() body: { user: User }) {
  //   return new QuestionService().likeQuestion(body.user, id);
  // }

  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  async updateQuestion(@Param('id') id: number, @Body() question: QuestionUpdateDto) {
    const tags = await new TagService().getOrCreateByNames(question.tags);
    return new QuestionService().update(
      id,
      question.subject,
      question.content,
      question.code,
      tags,
    );
  }

  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  async deleteQuestion(@Param('id') id: number) {
    await new QuestionService().delete(id);
    return `delete item number ${id}`;
  }

}
