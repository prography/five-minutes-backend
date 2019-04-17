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
      result: {
        items: [],
      },
    };
  }

  @Get('/:id')
  getUser(@Param('id') id: number) {
    return {
      result: { id },
    };
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    return {
      result: { ...user, id },
    };
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return {
      result: `delete item number ${id}`,
    };
  }

}
