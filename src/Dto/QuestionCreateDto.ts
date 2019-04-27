import { IsArray, IsString } from 'class-validator';
import { User } from '../models/User';

export class QuestionCreateDto {
  @IsString()
  subject!: string;
  @IsString()
  content!: string;
  @IsString()
  code!: string;
  @IsString()
  user!: User;
  @IsArray()
  tags!: string[];
}
