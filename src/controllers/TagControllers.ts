import { Body, Controller, Delete, Get, Param, Post } from 'routing-controllers';
import { Tag } from '../models/Tag';

@Controller('/tags')
export class TagController {

  @Post('/')
  create(@Body() tag: Tag) {
    return {
      result: tag,
    };
  }

  @Get('/')
  getTags() {
    return {
      result: {
        items: [],
      },
    };
  }

  @Get('/:id')
  getTag(@Param('id') id: number) {
    return {
      result: { id },
    };
  }

  @Delete('/:id')
  deleteTag(@Param('id') id: number) {
    return {
      result: `delete item number ${id}`,
    };
  }

}
