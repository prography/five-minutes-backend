import { QuestionTag } from '../models/QuestionTag';
import { BaseRepository } from './base/BaseRepository';

export class QuestionTagRepository extends BaseRepository<QuestionTag> {
  constructor() {
    super(QuestionTag);
  }
}
