import { DeleteResult } from 'typeorm';
import { Comment } from '../models/Comment';
import { CommentLike } from '../models/CommentLike';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { CommentLikeRepository } from '../repositories/CommentLikeRepository';
import { CommentRepository } from '../repositories/CommentRepository';

export class CommentService {

  private commentRepository: CommentRepository;
  private commentLikeRepository: CommentLikeRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
    this.commentLikeRepository = new CommentLikeRepository();
  }

  create(comment: Comment): Promise<Comment> {
    const newComment = new Comment();
    newComment.codeline = comment.codeline;
    newComment.content = comment.content;
    newComment.likedUsers = comment.likedUsers;
    newComment.question = comment.question;
    newComment.user = comment.user;
    return this.commentRepository.create(newComment);
  }

  update(id: number, comment: Partial<Comment>): Promise<Comment> {
    return this.commentRepository.update(id, comment);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.commentRepository.delete(id);
  }

  async getCommentsByQuestion(question: Question): Promise<[Comment[], number]> {
    return await this.commentRepository.findWithCount({ where: { question } });
  }
  async getLikedComments(user: User): Promise<[Comment[], number]> {
    return await this.commentRepository.findWithCount({ where: { user } });
  }

  async getLikedUsers(id: number): Promise<[CommentLike[], number]> {
    return await this.commentLikeRepository.findWithCount({ where: { id } });
  }

  async likeComment(user: User, comment: Comment): Promise<CommentLike | DeleteResult | undefined> {
    const target = await this.commentRepository.findOne({ where: { user, comment } });
    if (!target) {
      const newLikeComment = new CommentLike();
      newLikeComment.user = user;
      newLikeComment.comment = comment;
      return this.commentLikeRepository.create(newLikeComment);
    }
    return this.commentLikeRepository.delete(target.id);
  }
}
