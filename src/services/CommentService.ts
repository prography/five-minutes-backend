import { Comment } from '../models/Comment';
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

  update() { }

  delete() { }

  getCommentsByQuestionId() { }

  getLikedComments() { }

  getLikedUsers() { }

  likeComment() { }
}
