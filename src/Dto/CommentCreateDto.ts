import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
  @IsNumber()
  @IsNotEmpty()
  codeline!: number;
}
