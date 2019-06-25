import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentUpdateDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
  @IsNumber()
  @IsNotEmpty()
  codeline!: number;
  @IsNumber()
  @IsNotEmpty()
  codestring!: string;
}
