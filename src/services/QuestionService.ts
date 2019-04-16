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

  getQuestion(id: number): Promise<Question | undefined> {
    return this.questionRepository.findById(id);
  }

  async countLikes(id: number): Promise<number> {
    const result = await this.questionLikeRepository.findWithCount({ where: { id } });
    return result[1];
  }

  async addTag(name: string, question: Question): Promise<QuestionTag | undefined> {
    let tag = await this.tagRepository.findOne({ where: { name } });
    // 쓰려는 태그가 없는 경우
    if (!tag) {
      const newTag = new Tag();
      newTag.name = name;
      newTag.description = '아직 설명이 없습니다.';
      tag = await this.tagRepository.create(newTag);
    }
    const isTagged = await this.questionTagRepository.findOne({ where: { name, question } });
    // 이미 태그가 달려 있는 경우
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

  async likeQuestion(user: User, question: Question): Promise<QuestionLike | DeleteResult |undefined> {
    const target = await this.questionLikeRepository.findOne({ where: { user, question } });
    if (!target) {
      const newLikedQuestion = new QuestionLike();
      newLikedQuestion.user = user;
      newLikedQuestion.question = question;
      return this.questionLikeRepository.create(newLikedQuestion);
    }
    return this.questionLikeRepository.delete(target.id);
  }

  getLikedQuestions(user: User): Promise<[QuestionLike[], number]> {
  // findone 옵션 어떻게 주는지 모르겠음
  // https://typeorm.io/#/find-options 공부하자
    return this.questionLikeRepository.findWithCount({ where: { user } });
  }

  getQuestionsByTags() {}

  getQuestions() {}
}
