import { Comment } from '../models/Comment';
import { BaseRepository } from './base/BaseRepository';

export class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(Comment);
  }
}
