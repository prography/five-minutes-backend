import { DeleteResult } from 'typeorm';
import { Comment } from '../models/Comment';
import { CommentLike } from '../models/CommentLike';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { CommentLikeRepository } from '../repositories/CommentLikeRepository';
import { CommentRepository } from '../repositories/CommentRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { UserRepository } from '../repositories/UserRepository';

export class CommentService {

  private commentRepository: CommentRepository;
  private userRespository: UserRepository;
  private questionRepository: QuestionRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
    this.userRespository = new UserRepository();
    this.questionRepository = new QuestionRepository();
  }

  async create(content: string, codeline: number, questionId: number, userId: number): Promise<Comment> {
    const user = await this.userRespository.findById(userId);
    const question = await this.questionRepository.findById(questionId);
    if (!user || !question) throw Error('NO_USER OR NO QUESTION');
    const newComment = new Comment();
    newComment.codeline = codeline;
    newComment.content = content;
    newComment.question = question;
    newComment.user = user;
    return this.commentRepository.create(newComment);
  }

  update(id: number, comment: Partial<Comment>): Promise<Comment> {
    return this.commentRepository.update(id, comment);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.commentRepository.delete(id);
  }

  getCommentsByQuestion(question: Question): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({ where: { question }, relations: ['user'] });
  }
  getLikedComments(user: User): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({ where: { user }, relations: ['user'] });
  }

  getLikedUsers(id: number): Promise<[CommentLike[], number]> {
    return this.commentLikeRepository.findWithCount({ where: { id }, relations: ['user'] });
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
