import { CommentLike } from '../models/CommentLike';
import { BaseRepository } from './base/BaseRepository';

export class CommentLikeRepository extends BaseRepository<CommentLike> {
  constructor() {
    super(CommentLike);
  }
}
