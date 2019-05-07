import { IsNotEmpty, IsString } from 'class-validator';

export class TagCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsString()
  description!: string;
}
