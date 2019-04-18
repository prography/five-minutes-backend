import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptor } from 'routing-controllers';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { User } from '../models/User';

@Controller('/users')
export class UserController {

  @Post('/')
  create() {
    return 'result';
  }

  @Get('/')
  @UseInterceptor(PaginationInterceptor)
  getUsers() {
    return {
      items: [],
      page: 1,
      perPage: 10,
      totalCount: 100,
      count: 10,
    };
  }

  @Get('/:id')
  getUser(@Param('id') id: number) {
    return { id };
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    return { ...user, id };
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return `delete item number ${id}`;
  }

}
