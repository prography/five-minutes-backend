import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, UseInterceptor } from 'routing-controllers';
import { UserCreateDto } from '../Dto/UserCreateDto';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { User } from '../models/User';
import { UserService } from '../services/UserService';

@Controller('/users')
export class UserController {

  @Post('/')
  create(@Body() user: UserCreateDto) {
    return new UserService().create(
      user.email,
      user.nickname,
      user.password,
      user.githubUrl,
    );
  }

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
  getUser(@Param('id') id: number) {
    return new UserService().getUserById(id);
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() user: User) {
    return new UserService().update(id, user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    await new UserService().delete(id);
    return `delete item number ${id}`;
  }

}
