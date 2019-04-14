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
    return 'get all';
  }

  @Get('/:id')
  getQuestion(@Param('id') id: number) {
    return `get item number ${id}`;
  }

  @Delete('/:id')
  deleteQuestion(@Param('id') id: number) {
    return `delete item number ${id}`;
  }

  @Put('/:id')
  updateQuestion(@Param('id') id: number, @Body() question: Question) {
    return `update item number ${id} to ${question.toString()}`;
  }

}
