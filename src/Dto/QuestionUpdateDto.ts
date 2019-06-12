import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class QuestionUpdateDto {
  @IsString()
  @IsNotEmpty()
  subject!: string;
  @IsString()
  @IsNotEmpty()
  content!: string;
  @IsString()
  @IsNotEmpty()
  language!: string;
  @IsArray()
  tags!: string[];
}
