import { Body, Controller, Delete, Get, Param, Post, Put } from 'routing-controllers';
import { Question } from '../models/Question';

@Controller('/questions')
export class QuestionController  {

  @Post('/')
  create() {
    return 'result';
  }

  @Get('/')
  getQuestions() {
    return {
      result: {
        items: [],
      },
    };
  }

  @Get('/:id')
  getQuestion(@Param('id') id: number) {
    return {
      result: { id },
    };
  }

  @Get('/:id/comments')
  getQuestionComments(@Param('id') id: number) {
    return {
      result: { id },
    };
  }

  @Put('/:id/like')
  likeQuestion(@Param('id') id: number) {
    return {
      result: { id, like: true },
    };
  }

  @Put('/:id')
  updateQuestion(@Param('id') id: number, @Body() question: Question) {
    return {
      result: { ...question, id },
    };
  }

  @Delete('/:id')
  deleteQuestion(@Param('id') id: number) {
    return {
      result: `delete item number ${id}`,
    };
  }

}
