import { IsString } from 'class-validator';

export class TagCreateDto {
  @IsString()
  name!: string;
  @IsString()
  description!: string;
}
