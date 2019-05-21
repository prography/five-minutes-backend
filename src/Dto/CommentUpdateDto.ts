import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentUpdateDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
  @IsEnum('string')
  type!: string;
  @IsEnum('string')
  status!: string;
  @IsNumber()
  @IsNotEmpty()
  codeline!: number;
}
