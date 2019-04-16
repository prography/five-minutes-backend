import { DeleteResult, FindOneOptions } from 'typeorm';
import { Question } from '../models/Question';
import { QuestionLike } from '../models/QuestionLike';
import { QuestionTag } from '../models/QuestionTag';
import { User } from '../models/User';
import { QuestionLikeRepository } from '../repositories/QuestionLikeRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { QuestionTagRepository } from '../repositories/QuestionTagRepository';
import { UserRepository } from '../repositories/UserRepository';

export class QuestionService {

  private questionRepository: QuestionRepository;
  private questionLikeRepository: QuestionLikeRepository;
  private questiontagRepository: QuestionTagRepository;
  private userRepository: UserRepository;
  constructor() {
    this.questionRepository = new QuestionRepository();
    this.questionLikeRepository = new QuestionLikeRepository();
    this.questiontagRepository = new QuestionTagRepository();
    this.userRepository = new UserRepository();
  }

  create(question: Question): Promise<Question> {
    const newQuestion = new Question();
    newQuestion.subject = question.subject;
    newQuestion.content = question.content;
    newQuestion.code = question.code;
    newQuestion.user = question.user;
    newQuestion.likedUsers = question.likedUsers;
    newQuestion.comments = question.comments;
    newQuestion.tags = question.tags;
    return this.questionRepository.create(newQuestion);
  }

  update(id: number, question: Partial<Question>): Promise<Question> {
    return this.questionRepository.update(id, question);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.questionRepository.delete(id);
  }

  getQuestion(id: number): Promise<Question | undefined> {
    return this.questionRepository.findById(id);
  }

  countLikes(id: number): Promise<QuestionLike | undefined> {
    return this.questionLikeRepository.findById(id);
  }

  addTag(questiontag: QuestionTag): Promise<QuestionTag | undefined> {
    const newTag = new QuestionTag();
    newTag.tag = questiontag.tag;
    newTag.question = questiontag.question;
    return this.questiontagRepository.create(newTag);
  }

  removeTag(id: number): Promise<DeleteResult> {
    return this.questiontagRepository.delete(id);
  }

  likeQuestion(questionlike: QuestionLike): Promise<QuestionLike | undefined> {
    const newquestionlike = new QuestionLike();
    newquestionlike.user = questionlike.user;
    newquestionlike.question = questionlike.question;
    return this.questionLikeRepository.create(questionlike);
  }

  getLikedQuestions(likedquestions: FindOneOptions<User>): Promise<User | undefined> {
  // findone 옵션 어떻게 주는지 모르겠음
    return this.userRepository.findOne(likedquestions);
  }

  getQuestionsByTags() {}

  getQuestions() {}
}
