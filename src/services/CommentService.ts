import { DeleteResult, getCustomRepository, getRepository, In } from 'typeorm';
import { CommentCreateDto } from '../Dto/CommentCreateDto';
import { CommentUpdateDto } from '../Dto/CommentUpdateDto';
import { Comment, CommentStatus } from '../models/Comment';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { CommentRepository } from '../repositories/CommentRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';

export class CommentService {

  private commentRepository: CommentRepository;
  private questionRepository: QuestionRepository;
  private commentRelations = ['user', 'dislikedUsers', 'likedUsers', 'question'];

  constructor() {
    this.commentRepository = getCustomRepository(CommentRepository);
    this.questionRepository = getCustomRepository(QuestionRepository);
  }

  async create(user: User, comment: CommentCreateDto, questionId: number): Promise<Comment> {
    const question = await this.questionRepository.findById(questionId);
    if (!user || !question) throw Error('NO_USER OR NO QUESTION');
    const newComment = new Comment();
    newComment.codeline = comment.codeline;
    newComment.codestring = comment.codestring;
    newComment.content = comment.content;
    newComment.question = question;
    newComment.user = user;
    return this.commentRepository.save(newComment);
  }

  updateStatus(id: number, status: CommentStatus) {
    const newComment = new Comment();
    newComment.status = status;
    return this.commentRepository.updateAndGet(id, newComment);
  }

  async update(id: number, commentForm: CommentUpdateDto): Promise<Comment> {
    const newComment = await this.commentRepository.findById(id);
    if (!newComment) throw Error('NO_COMMNET');
    if (![CommentStatus.PENDING, CommentStatus.WAIT].includes(newComment.status)) throw Error('CAN_NOT_MODIFY');
    newComment.codeline = commentForm.codeline;
    newComment.codestring = commentForm.codestring;
    newComment.content = commentForm.content;
    return this.commentRepository.updateAndGet(id, newComment);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.commentRepository.delete(id);
  }

  getCommentsByUser(user: User): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({
      where: { user }, relations: this.commentRelations });
  }

  getCommentsByQuestion(question: Question): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({
      where: { question }, relations: this.commentRelations });
  }

  getCommentsByQuestionId(questionId: number): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({
      where: { question: { id: questionId } }, relations: this.commentRelations });
  }

  async getCommentsByLikedUser(user: User): Promise<[Comment[], number]> {
    const result = await getRepository(Question)
      .query(
        'SELECT clu.comments_id as id FROM comment_liked_users clu where clu.users_id = ?',
        [user.id],
      );
    const ids = result.length ? result.map((u: { id: number }) => u.id) : [-1];
    return this.commentRepository.findWithCount({
      where: { id: In(ids) }, relations: this.commentRelations,
    });
  }

  async getCommentsByDislikedUser(user: User): Promise<[Comment[], number]> {
    const result = await getRepository(Question)
      .query(
        'SELECT cdu.comments_id as id FROM comment_disliked_users cdu where cdu.users_id = ?',
        [user.id],
      );
    const ids = result.length ? result.map((u: { id: number }) => u.id) : [-1];
    return this.commentRepository.findWithCount({
      where: { id: In(ids) }, relations: this.commentRelations,
    });
  }

  async like(id: number, user: User) {
    const comment = <Comment>await this.commentRepository.findById(id, { relations: this.commentRelations });
    if (comment.isLikedUser(user)) {
      comment.likedUsers.splice(comment.idsOfLikedUsers.indexOf(user.id), 1);
      return this.commentRepository.save(comment);
    }
    comment.likedUsers.push(user);
    return this.commentRepository.save(comment);
  }

  async dislike(id: number, user: User) {
    const comment = <Comment>await this.commentRepository.findById(id, { relations: this.commentRelations });
    if (comment.isDislikedUser(user)) {
      comment.dislikedUsers.splice(comment.idsOfDislikedUsers.indexOf(user.id), 1);
      return this.commentRepository.save(comment);
    }
    comment.dislikedUsers.push(user);
    return this.commentRepository.save(comment);
  }

  async resolve(id: number, user: User) {
    const comment = <Comment>await this.commentRepository.findById(id, { relations: ['question', 'question.user'] });
    if (comment.question.user.id !== user.id) throw Error('NO_WRITER');
    if (comment.status !== CommentStatus.RESOLVE) {
      return this.commentRepository.updateAndGet(id, { status: CommentStatus.RESOLVE });
    }
    return comment;
  }

}
