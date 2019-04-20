import { IsNumber, IsString } from 'class-validator';

export class CommentCreateDto {
  @IsString()
  content!: string;
  @IsNumber()
  question!: number;
  @IsNumber()
  user!: number;
  @IsNumber()
  codeline!: number;
}
