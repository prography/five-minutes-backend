import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParam, UseInterceptor } from 'routing-controllers';
import { UserCreateDto } from '../Dto/UserCreateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { UserService } from '../services/UserService';
import { UserUpdateDto } from './../Dto/UserUpdateDto';

@JsonController('/users')
export class UserController {

  @Post('/')
  @UseInterceptor(EntityInterceptor)
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
  @UseInterceptor(EntityInterceptor)
  getUser(@Param('id') id: number) {
    return new UserService().getUserById(id);
  }

  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  updateUser(@Param('id') id: number, @Body() user: UserUpdateDto) {
    return new UserService().update(id, user);
  }

  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  async deleteUser(@Param('id') id: number) {
    await new UserService().delete(id);
    return `delete item number ${id}`;
  }

}
