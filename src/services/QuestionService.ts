import { DeleteResult, FindConditions, getRepository, In, MoreThan } from 'typeorm';
import { QuestionUpdateDto } from '../Dto/QuestionUpdateDto';
import { Question } from '../models/Question';
import { User } from '../models/User';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { QueryHelper } from '../utils/QueryHelper';
import { Tag } from './../models/Tag';

export class QuestionService {

  private questionRepository: QuestionRepository;

  private questionRelations = [
    'tags', 'likedUsers', 'dislikedUsers', 'user',
    'comments', 'comments.user', 'comments.likedUsers', 'comments.dislikedUsers',
  ];

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
    const newQuestion = <Question>await this.questionRepository.findById(id);
    newQuestion.subject = questionForm.subject;
    newQuestion.content = questionForm.content;
    newQuestion.code = questionForm.code;
    newQuestion.tags = tags;
    // 질문 수정
    return this.questionRepository.create(newQuestion);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.questionRepository.delete(id);
  }

  async getLikedNumber(id: number): Promise<number> {
    const question = <Question>await this.questionRepository.findById(id, { relations: ['likedUsers'] });
    return question.likedUsers.length;
  }

  async getDislikedNumber(id: number): Promise<Number> {
    const question = <Question>await this.questionRepository.findById(id, { relations: ['dislikedUsers'] });
    return question.dislikedUsers.length;
  }

  async addTag(tag: Tag, questionId: number): Promise<Question> {
    const question = <Question>await this.questionRepository.findById(questionId, { relations: this.questionRelations });
    if (question.tagNames.includes(tag.name)) throw Error('ALREADY_EXIST');
    question.tags.push(tag);
    return this.questionRepository.create(question);
  }

  async removeTag(tag: Tag, questionId: number): Promise<Question> {
    const question = <Question>await this.questionRepository.findById(questionId, { relations: this.questionRelations });
    if (!question.tagNames.includes(tag.name)) throw Error('DOES_NOT_TAGGED');
    question.tags.splice(question.tagNames.indexOf(tag.name), 1);
    return this.questionRepository.create(question);
  }

  async like(questionId: number, user: User): Promise<Question> {
    const question = <Question>await this.questionRepository.findById(questionId, { relations: this.questionRelations });
    if (question.isLikedUser(user)) {
      question.likedUsers.splice(question.idsOfLikedUsers.indexOf(user.id), 1);
      return this.questionRepository.create(question);
    }
    question.likedUsers.push(user);
    return this.questionRepository.create(question);
  }

  async dislike(questionId: number, user: User): Promise<Question> {
    const question = <Question>await this.questionRepository.findById(questionId, { relations: this.questionRelations });
    if (question.isDislikedUser(user)) {
      question.dislikedUsers.splice(question.idsOfLikedUsers.indexOf(user.id), 1);
      return this.questionRepository.create(question);
    }
    question.dislikedUsers.push(user);
    return this.questionRepository.create(question);
  }

  getQuestionsByLikedUser(user: User): Promise<[Question[], number]> {
    return this.questionRepository.findWithCount({
      where: { 'likedUsers.id': In([user.id]) }, relations: this.questionRelations });
  }

  getQuestionsByDislikedUser(user: User): Promise<[Question[], number]> {
    return this.questionRepository.findWithCount({
      where: { 'dislikedUsers.id': In([user.id]) }, relations: this.questionRelations });
  }

  getQuestionById(id: number): Promise<Question | undefined> {
    return this.questionRepository.findById(id, { relations: this.questionRelations });
  }

  async getQuestions(
    take: number,
    skip: number,
    options: { lastId?: number, subject?: string, tags?: Tag[], language?: string },
  ): Promise<[Question[], number]> {
    const questionQueryBuilder = new QueryHelper<Question>(Question, 'question');

    if (options.lastId) questionQueryBuilder.andWhere('question.id > :id', { id: options.lastId });
    if (options.subject) questionQueryBuilder.andWhere('question.subject like :subject', { subject: `%${options.subject}%` });
    if (options.language) questionQueryBuilder.andWhere('question.language = :language', { language: options.language });
    if (options.tags && options.tags.length) {
      const tags: any[] = await getRepository(Question)
        .query(
          'SELECT question_tags.questions_id as id FROM question_tags where question_tags.tags_id IN (?)',
          [options.tags.map(tag => tag.id)],
        );
      if (tags.length) {
        questionQueryBuilder.andWhere('question.id IN (:...ids)');
        questionQueryBuilder.setParameter('ids', tags.map((tag: { id: any }) => tag.id));
      } else {
        questionQueryBuilder.andWhere('question.id IN (:...ids)');
        questionQueryBuilder.setParameter('ids', [-1]);
      }
    }
    questionQueryBuilder.addRelation('question.tags', 'tags');
    questionQueryBuilder.addRelation('question.user', 'user');
    questionQueryBuilder.addRelation('question.likedUsers', 'likedUsers');
    questionQueryBuilder.addRelation('question.dislikedUsers', 'dislikedUsers');
    questionQueryBuilder.take(take);
    questionQueryBuilder.skip(skip);
    // console.log(questionQueryBuilder.query);
    // console.log(questionQueryBuilder.params);
    const count = await questionQueryBuilder.count();
    const items = await questionQueryBuilder.getMany();
    return [items, count];
  }

  getQuestionsByTags(tags: Tag[], take: number, skip: number, lastId?: number): Promise<[Question[], number]> {
    const where: FindConditions<Question> = {};
    if (lastId) where.id = MoreThan(lastId);
    return this.questionRepository.findWithCount({
      take, skip, where: { ...where, 'tags.name': In(tags.map(tag => tag.name)) }, relations: this.questionRelations });
  }

  getQuestionsByUser(user : User): Promise<[Question[], number]> {
    return this.questionRepository.findWithCount({ where: { user } });
  }
}
