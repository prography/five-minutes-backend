import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { Question } from '../models/Question';

@Controller('/questions')
export class QuestionController  {

  @Post('/')
  @UseInterceptor(EntityInterceptor)
  create() {
    return 'result';
  }

  @Get('/')
  @UseInterceptor(PaginationInterceptor)
  getQuestions() {
    return {
      items: [],
    };
  }

  @Get('/:id')
  @UseInterceptor(EntityInterceptor)
  getQuestion(@Param('id') id: number) {
    return { id };
  }

  @Get('/:id/comments')
  @UseInterceptor(EntityInterceptor)
  getQuestionComments(@Param('id') id: number) {
    return { id };
  }

  @Put('/:id/like')
  @UseInterceptor(EntityInterceptor)
  likeQuestion(@Param('id') id: number) {
    return { id, like: true };
  }

  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  updateQuestion(@Param('id') id: number, @Body() question: Question) {
    return { ...question, id };
  }

  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  deleteQuestion(@Param('id') id: number) {
    return `delete item number ${id}`;
  }

}
