import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParam, UseInterceptor } from 'routing-controllers';
import { TagCreateDto } from '../Dto/TagCreateDto';
import { TagUpdateDto } from '../Dto/TagUpdateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { TagService } from '../services/TagService';

@JsonController('/tags')
export class TagController {

  @Post('/')
  @UseInterceptor(EntityInterceptor)
  create(@Body() tag: TagCreateDto) {
    return new TagService().create(
      tag.name,
      tag.description,
    );
  }

  @Get('/')
  @UseInterceptor(PaginationInterceptor)
  async getTags(
    @QueryParam('page', { required: true }) page: number,
    @QueryParam('perPage', { required: true }) perPage: number,
  ) {
    const [items, totalCount] = await new TagService().getTags(perPage, (page - 1) * perPage);
    return {
      items,
      totalCount,
      page,
      perPage,
      count: items.length,
    };
  }

  @Get('/search')
  @UseInterceptor(PaginationInterceptor)
  async searchTags(
    @QueryParam('name') name: string,
    @QueryParam('page', { required: true }) page: number,
    @QueryParam('perPage', { required: true }) perPage: number,
  ) {
    const [items, totalCount] = await new TagService().getByName(name, perPage, (page - 1) * perPage);
    return {
      items,
      totalCount,
      page,
      perPage,
      count: items.length,
    };
  }

  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  updateTag(@Param('id') id: number, @Body() tag: TagUpdateDto) {
    return new TagService().update(id, tag);
  }

  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  async deleteTag(@Param('id') id: number) {
    await new TagService().delete(id);
    return `delete item number ${id}`;
  }

}
