import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { Honor } from '../models/Honor';
import { HonorService } from '../services/HonorService';

@JsonController('/honors')
export class HonorController {
  @Post()
  @UseInterceptor(EntityInterceptor)
  async create(@Body() honor: { name: string, mail: string, agreeReceivingMail: boolean, duration: number }) {
    const result = await new HonorService().create(honor.name, honor.mail, honor.agreeReceivingMail, honor.duration);
    return result;
  }

  @Get()
  @UseInterceptor(PaginationInterceptor)
  async getHonors() {
    const [items, totalCount] = await new HonorService().list();
    console.log(items, totalCount);
    return {
      totalCount,
      items,
    };
  }

  @Authorized()
  @Put('/:id')
  @UseInterceptor(EntityInterceptor)
  async update(@Param('id') id: number, @Body() honor: Partial<Honor>) {
    const result = await new HonorService().update(id, honor);
    return result;
  }

  @Authorized()
  @Delete('/:id')
  @UseInterceptor(EntityInterceptor)
  async delete(@Param('id') id: number) {
    const result = await new HonorService().delete(id);
    return result;
  }
}
