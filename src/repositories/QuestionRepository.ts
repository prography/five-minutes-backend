import { Question } from '../models/Question';
import { BaseRepository } from './base/BaseRepository';

export class QuestionRepository extends BaseRepository<Question> {
  constructor() {
    super(Question);
  }
}
