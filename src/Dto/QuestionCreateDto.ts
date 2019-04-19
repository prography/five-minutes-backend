import { User } from '../models/User';

export interface QuestionCreateDto {
  subject: string;
  content: string;
  code: string;
  user: User;
  tags: string[];
}
