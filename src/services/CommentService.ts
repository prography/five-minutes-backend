import { DeleteResult, In } from 'typeorm';
import { CommentUpdateDto } from '../Dto/CommentUpdateDto';
import { Comment, CommentStatus } from '../models/Comment';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { CommentRepository } from '../repositories/CommentRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';

export class CommentService {

  private commentRepository: CommentRepository;
  private questionRepository: QuestionRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
    this.questionRepository = new QuestionRepository();
  }

  async create(
    user: User, content: string, codeline: number, questionId: number): Promise<Comment> {
    const question = await this.questionRepository.findById(questionId);
    if (!user || !question) throw Error('NO_USER OR NO QUESTION');
    const newComment = new Comment();
    newComment.codeline = codeline;
    newComment.content = content;
    newComment.question = question;
    newComment.user = user;
    return this.commentRepository.create(newComment);
  }

  updateStatus(id: number, status: CommentStatus) {
    const newComment = new Comment();
    newComment.status = status;
    return this.commentRepository.update(id, newComment);
  }

  update(id: number, commentForm: CommentUpdateDto): Promise<Comment> {
    const newComment = new Comment();
    newComment.codeline = commentForm.codeline;
    newComment.content = commentForm.content;
    return this.commentRepository.update(id, newComment);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.commentRepository.delete(id);
  }

  getCommentsByUser(user: User): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { user }, relations: ['user', 'likedUsers', 'dislikedUsers'] });
  }

  getCommentsByQuestion(question: Question): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({
      where: { question }, relations: ['user', 'likedUsers', 'dislikedUsers'] });
  }

  getCommentsByQuestionId(questionId: number): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({
    where: { question: { id: questionId } }, relations: ['user', 'likedUsers', 'dislikedUsers'] });
  }

  getCommentsByLikedUser(user: User): Promise<[Comment[], number]> {
    return this.commentRepository.findWithCount({
      where: { likedUsers: In([user]) }, relations: ['user', 'likedUsers', 'dislikedUsers'], order: { createdAt: 'DESC' } });
  }

  async like(id: number, user: User) {
    const comment = <Comment>await this.commentRepository.findById(id, { relations: ['likedUsers'] });
    if (comment.isLikedUser(user)) {
      comment.likedUsers.splice(comment.idsOfLikedUsers.indexOf(user.id), 1);
      return this.commentRepository.create(comment);
    }
    comment.likedUsers.push(user);
    return this.commentRepository.create(comment);
  }

  async dislike(id: number, user: User) {
    const comment = <Comment>await this.commentRepository.findById(id, { relations: ['dislikedUsers'] });
    if (comment.isDislikedUser(user)) {
      comment.dislikedUsers.splice(comment.idsOfDislikedUsers.indexOf(user.id), 1);
      return this.commentRepository.create(comment);
    }
    comment.dislikedUsers.push(user);
    return this.commentRepository.create(comment);
  }

  async resolve(id: number, user: User) {
    const comment = <Comment>await this.commentRepository.findById(id, { relations: ['question', 'question.user'] });
    if (comment.question.user.id !== user.id) throw Error('NO_WRITER');
    if (comment.status !== CommentStatus.RESOLVE) {
      return this.commentRepository.update(id, { status: CommentStatus.RESOLVE });
    }
    return comment;
  }

}
