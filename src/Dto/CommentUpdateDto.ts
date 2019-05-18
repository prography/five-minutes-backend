import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentUpdateDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
  @IsString()
  @IsNotEmpty()
  type!: string;
  @IsString()
  @IsNotEmpty()
  status!: string;
  @IsNumber()
  @IsNotEmpty()
  codeline!: number;
}
