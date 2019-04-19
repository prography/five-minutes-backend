import { User } from '../models/User';

export interface QuestionUpdateDto {
  subject: string;
  content: string;
  code: string;
  user: User;
  tags: string[];
}
