import { QuestionLike } from '../models/QuestionLike';
import { BaseRepository } from './base/BaseRepository';

export class QuestionLikeRepository extends BaseRepository<QuestionLike> {
  constructor() {
    super(QuestionLike);
  }
}
