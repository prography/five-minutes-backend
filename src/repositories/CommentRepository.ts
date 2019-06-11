import { EntityRepository } from 'typeorm';
import { Comment } from '../models/Comment';
import { BaseRepository } from './base/BaseRepository';

@EntityRepository(Comment)
export class CommentRepository extends BaseRepository<Comment> {}
