import { DeleteResult, In } from 'typeorm';
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
    let tag = await this.tagRepository.findOne({ where:{ name } });
    if (!tag) {
      const newTag = new Tag();
      newTag.name = name;
      newTag.description = '아직 설명이 없습니다.';
      tag = await this.tagRepository.create(newTag);
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

  async likeQuestion(user: User, questionId: number): Promise<QuestionLike | DeleteResult | undefined> {
    const question = await this.questionRepository.findById(questionId);
    if (!question) throw Error('NO_QUESTION');
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

  async getQuestions(take: number, skip: number): Promise<[Question[], number]> {
    return await this.questionRepository.findWithCount({ skip, take });
  }

  async getQuestionsByTags(tags: Tag[], take: number, skip: number): Promise<[Question[], number]> {
    return await this.questionRepository.findWithCount({ take, skip, where: { 'tags.name': In(tags.map(tag => tag.name)) } });
  }

  getQuestionByUser(user : User): Promise<Question | undefined> {
    return this.questionRepository.findOne({ where: { user } });
  }
}
