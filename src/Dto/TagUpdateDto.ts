import { IsString } from 'class-validator';

export class TagUpdateDto {
  @IsString()
  description!: string;
}
