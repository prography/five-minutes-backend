import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class QuestionCreateDto {
  @IsString()
  @IsNotEmpty()
  subject!: string;
  @IsString()
  @IsNotEmpty()
  content!: string;
  @IsString()
  @IsNotEmpty()
  code!: string;
  @IsString()
  @IsNotEmpty()
  language!: string;
  @IsArray()
  tags!: string[];
}
