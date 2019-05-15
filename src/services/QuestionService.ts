import { DeleteResult, FindConditions, In, MoreThan } from 'typeorm';
import { QuestionUpdateDto } from '../Dto/QuestionUpdateDto';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { Tag } from './../models/Tag';

export class QuestionService {

  private questionRepository: QuestionRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  async create(user: User, subject: string, content: string, code: string, language: string, tags: Tag[]): Promise<Question> {
    // 질문 인스턴스 생성
    const newQuestion = new Question();
    newQuestion.subject = subject;
    newQuestion.content = content;
    newQuestion.code = code;
    newQuestion.language = language;
    newQuestion.user = user;
    newQuestion.tags = tags;
    // 짊문 생성
    return this.questionRepository.create(newQuestion);

  }

  async update(id: number, questionForm: QuestionUpdateDto, tags: Tag[]): Promise<Question> {
    // 질문 객체 생성
    const newQuestion = new Question();
    newQuestion.subject = questionForm.subject;
    newQuestion.content = questionForm.content;
    newQuestion.code = questionForm.code;
    newQuestion.tags = tags;
    // 질문 수정
    return this.questionRepository.update(id, newQuestion);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.questionRepository.delete(id);
  }

  async countLikes(id: number): Promise<number> {
    const question = <Question>await this.questionRepository.findById(id, { relations: ['likedUsers'] });
    return question.likedUsers.length;
  }

  // async addTag(name: string, questionId: number): Promise<undefined> {
  //   let tag = <Tag>await this.tagRepository.findOne({ where:{ name } });
  //   if (!tag) {
  //     const newTag = new Tag();
  //     newTag.name = name;
  //     newTag.description = '아직 설명이 없습니다.';
  //     tag = await this.tagRepository.create(newTag);
  //   }
  //   const question: Question = <Question>await this.questionRepository.findById(questionId, { relations: ['tags'] });
  //   if (question.tags.find(t => t.id === tag.id)) throw Error('TAGGED_ALREADY');

  //   return this.questionRepository.update(question.id, { ...question, tags: [...question.tags, tag] });
  // }

  // async removeTag(name: string, question: Question): Promise<DeleteResult> {
  //   const target = await this.questionTagRepository.findOne({ where: { name, question } });
  //   if (!target) throw Error('DOES_NOT_TAGGED');
  //   return this.questionTagRepository.delete(target.id);
  // }

  // async likeQuestion(user: User, questionId: number): Promise<QuestionLike | DeleteResult | undefined> {
  //   const question = await this.questionRepository.findById(questionId);
  //   if (!question) throw Error('NO_QUESTION');
  //   const target = await this.questionLikeRepository.findOne({ where: { user, question } });
  //   if (!target) {
  //     const newLikedQuestion = new QuestionLike();
  //     newLikedQuestion.user = user;
  //     newLikedQuestion.question = question;
  //     return this.questionLikeRepository.create(newLikedQuestion);
  //   }
  //   return this.questionLikeRepository.delete(target.id);
  // }

  // async getLikedQuestions(user: User): Promise<[QuestionLike[], number]> {
  //   const target = await this.questionLikeRepository.findWithCount({ where: { user } });
  //   return target;
  // }

  getQuestion(id: number): Promise<Question | undefined> {
    return this.questionRepository.findById(id, { relations: [
      'tags', 'likedUsers', 'comments', 'comments.user', 'comments.likedUsers'] });
  }

  getQuestions(take: number, skip: number, lastId?: number): Promise<[Question[], number]> {
    const where: FindConditions<Question> = {};
    if (lastId) where.id = MoreThan(lastId);
    return this.questionRepository.findWithCount({
      skip, take, where, relations: ['tags'], order: { createdAt: 'DESC' } });
  }

  getQuestionsByTags(tags: Tag[], take: number, skip: number, lastId?: number): Promise<[Question[], number]> {
    const where: FindConditions<Question> = {};
    if (lastId) where.id = MoreThan(lastId);
    return this.questionRepository.findWithCount({
      take, skip, where: { ...where, 'tags.name': In(tags.map(tag => tag.name)) }, relations: ['tags'] });
  }

  getQuestionByUser(user : User): Promise<Question | undefined> {
    return this.questionRepository.findOne({ where: { user } });
  }
}
