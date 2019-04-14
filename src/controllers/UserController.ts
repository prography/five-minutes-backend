import { Body, Controller, Delete, Get, Param, Post, Put } from 'routing-controllers';
import { User } from '../models/User';

@Controller('/users')
export class UserController {

  @Post('/')
  create() {
    return 'result';
  }

  @Get('/')
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
