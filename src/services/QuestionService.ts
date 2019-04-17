import { DeleteResult } from 'typeorm';
import { Question } from '../models/Question';
import { QuestionLike } from '../models/QuestionLike';
import { QuestionTag } from '../models/QuestionTag';
import { Tag } from '../models/Tag';
import { User } from '../models/User';
import { QuestionLikeRepository } from '../repositories/QuestionLikeRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { QuestionTagRepository } from '../repositories/QuestionTagRepository';
import { TagRepository } from '../repositories/TagRepository';

export class QuestionService {

  private questionRepository: QuestionRepository;
  private questionLikeRepository: QuestionLikeRepository;
  private questionTagRepository: QuestionTagRepository;
  private tagRepository: TagRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
    this.questionLikeRepository = new QuestionLikeRepository();
    this.questionTagRepository = new QuestionTagRepository();
    this.tagRepository = new TagRepository();

  }

  create(user: User, subject: string, content: string, code: string): Promise<Question> {
    const newQuestion = new Question();
    newQuestion.subject = subject;
    newQuestion.content = content;
    newQuestion.code = code;
    newQuestion.user = user;
    return this.questionRepository.create(newQuestion);
  }

  update(id: number, question: Partial<Question>): Promise<Question> {
    return this.questionRepository.update(id, question);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.questionRepository.delete(id);
  }

  async countLikes(id: number): Promise<number> {
    const result = await this.questionLikeRepository.findWithCount({ where: { id } });
    return result[1];
  }

  async addTag(name: string, question: Question): Promise<QuestionTag | undefined> {
    const tag = await this.tagRepository.findOne({ where:{ name } });
    if (!tag) {
      const newTag = new Tag();
      newTag.name = name;
      newTag.description = '아직 설명이 없습니다.';
    }
    const isTagged = await this.questionTagRepository.findOne({ where: { name, question } });
    if (!!isTagged) throw Error('TAGGED_ALREADY');
    const newTag = new QuestionTag();
    newTag.tag = tag;
    newTag.question = question;
    return this.questionTagRepository.create(newTag);
  }

  async removeTag(name: string, question: Question): Promise<DeleteResult> {
    const target = await this.questionTagRepository.findOne({ where: { name, question } });
    if (!target) throw Error('DOES_NOT_TAGGED');
    return this.questionTagRepository.delete(target.id);
  }

  async likeQuestion(user: User, question: Question): Promise<QuestionLike | DeleteResult | undefined> {
    const target = await this.questionLikeRepository.findOne({ where: { user, question } });
    if (!target) {
      const newLikedQuestion = new QuestionLike();
      newLikedQuestion.user = user;
      newLikedQuestion.question = question;
      return this.questionLikeRepository.create(newLikedQuestion);
    }
    return this.questionLikeRepository.delete(target.id);
  }

  async getLikedQuestions(user: User): Promise<[QuestionLike[], number]> {
    const target = await this.questionLikeRepository.findWithCount({ where: { user } });
    return target;
  }

  getQuestion(id: number): Promise<Question | undefined> {
    return this.questionRepository.findById(id);
  }

  async getQuestions(id: number): Promise<Question[]> {
    const result = await this.questionRepository.find({ where: { id } });
    return result;
  }

  async getQuestionsByTags(tag: QuestionTag): Promise<[Question[], number]> {
    const result = await this.questionRepository.findWithCount({ where: { tag } });
    return result;
  }

}
