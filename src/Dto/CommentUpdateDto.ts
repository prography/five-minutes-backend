import { IsNumber, IsString } from 'class-validator';

export class CommentUpdateDto {
  @IsString()
  content!: string;
  @IsNumber()
  codeline!: number;
}
