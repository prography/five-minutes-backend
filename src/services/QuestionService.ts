import { DeleteResult, In } from 'typeorm';
import { QuestionUpdateDto } from '../Dto/QuestionUpdateDto';
import { Question } from '../models/Question';
import { Tag } from '../models/Tag';
import { User } from '../models/User';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { TagRepository } from '../repositories/TagRepository';

export class QuestionService {

  private questionRepository: QuestionRepository;
  private tagRepository: TagRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
    this.tagRepository = new TagRepository();

  }

  async create(user: User, subject: string, content: string, code: string, tags: string[]): Promise<Question> {
    // 질문 인스턴스 생성
    const newQuestion = new Question();
    newQuestion.subject = subject;
    newQuestion.content = content;
    newQuestion.code = code;
    newQuestion.user = user;
    //  태그 없으면 생성
    const newTags: Tag[] = [];
    for (let i = 0; i < tags.length; i += 1) {
      if (!await this.tagRepository.findOne({ where: { name: tags[i] } })) {
        newTags.push(await this.tagRepository.create({ name: tags[i], description: '' }));
      }
    }
    // 짊문 생성
    return this.questionRepository.create({ ...newQuestion, tags: newTags });

  }

  async update(id: number, question: QuestionUpdateDto): Promise<Question> {
    // 질문 객체 생성
    const newQuestion = new Question();
    newQuestion.subject = question.subject;
    newQuestion.content = question.content;
    newQuestion.code = question.code;
    newQuestion.user = question.user;
    //  태그 없으면 생성
    const newTags: Tag[] = [];
    for (let i = 0; i < question.tags.length; i += 1) {
      if (!await this.tagRepository.findOne({ where: { name: question.tags[i] } })) {
        newTags.push(await this.tagRepository.create({ name: question.tags[i], description: '' }));
      }
    }
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

  getQuestions(take: number, skip: number): Promise<[Question[], number]> {
    return this.questionRepository.findWithCount({ skip, take, relations: ['tags'] });
  }

  getQuestionsByTags(tags: Tag[], take: number, skip: number): Promise<[Question[], number]> {
    return this.questionRepository.findWithCount({
      take, skip, where: { 'tags.name': In(tags.map(tag => tag.name)) }, relations: ['tags'] });
  }

  getQuestionByUser(user : User): Promise<Question | undefined> {
    return this.questionRepository.findOne({ where: { user } });
  }
}
