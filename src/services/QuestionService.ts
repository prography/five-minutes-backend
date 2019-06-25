import { DeleteResult, FindConditions, getCustomRepository, getRepository, In, MoreThan } from 'typeorm';
import { QuestionUpdateDto } from '../Dto/QuestionUpdateDto';
import { CommentStatus } from '../models/Comment';
import { Question, QuestionStatus } from '../models/Question';
import { User } from '../models/User';
import { CommentRepository } from '../repositories/CommentRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { QueryHelper } from '../utils/QueryHelper';
import { Tag } from './../models/Tag';

export class QuestionService {

  private questionRepository: QuestionRepository;
  private commentRepository: CommentRepository;

  private questionRelations = [
    'tags', 'likedUsers', 'dislikedUsers', 'user',
    'comments', 'comments.user', 'comments.likedUsers', 'comments.dislikedUsers',
  ];

  constructor() {
    this.questionRepository = getCustomRepository(QuestionRepository);
    this.commentRepository = getCustomRepository(CommentRepository);
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
    return this.questionRepository.save(newQuestion);

  }

  async update(id: number, questionForm: QuestionUpdateDto, tags: Tag[]): Promise<Question> {
    // 질문 객체 생성
    const newQuestion = <Question>await this.questionRepository.findById(id);
    if (newQuestion.status === QuestionStatus.PENDING) throw Error('CANT_EDIT');
    newQuestion.subject = questionForm.subject;
    newQuestion.content = questionForm.content;
    newQuestion.tags = tags;
    // 질문 수정
    return this.questionRepository.save(newQuestion);
  }

  async correctQuestion(id: number, code: string, commentId: number) {
    // 코드 삽입
    await this.questionRepository.update(id, { code });
    // 질문 해결 표시
    return this.commentRepository.updateAndGet(commentId, { status: CommentStatus.RESOLVE });
  }

  async updateStatus(id: number, status: QuestionStatus) {
    return this.questionRepository.updateAndGet(id, { status });
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
    return this.questionRepository.save(question);
  }

  async removeTag(tag: Tag, questionId: number): Promise<Question> {
    const question = <Question>await this.questionRepository.findById(questionId, { relations: this.questionRelations });
    if (!question.tagNames.includes(tag.name)) throw Error('DOES_NOT_TAGGED');
    question.tags.splice(question.tagNames.indexOf(tag.name), 1);
    return this.questionRepository.save(question);
  }

  async addView(id: number): Promise<void> {
    await this.questionRepository.increment({ id }, 'view', 1);
  }

  async like(questionId: number, user: User): Promise<Question> {
    const question = <Question>await this.questionRepository.findById(questionId, { relations: this.questionRelations });
    if (question.isLikedUser(user)) {
      question.likedUsers.splice(question.idsOfLikedUsers.indexOf(user.id), 1);
      return this.questionRepository.save(question);
    }
    question.likedUsers.push(user);
    return this.questionRepository.save(question);
  }

  async dislike(questionId: number, user: User): Promise<Question> {
    const question = <Question>await this.questionRepository.findById(questionId, { relations: this.questionRelations });
    if (question.isDislikedUser(user)) {
      question.dislikedUsers.splice(question.idsOfLikedUsers.indexOf(user.id), 1);
      return this.questionRepository.save(question);
    }
    question.dislikedUsers.push(user);
    return this.questionRepository.save(question);
  }

  async getQuestionsByLikedUser(user: User): Promise<[Question[], number]> {
    const result = await getRepository(Question)
      .query(
        'SELECT qlu.questions_id as id FROM question_liked_users qlu where qlu.users_id = ?',
        [user.id],
      );
    const ids = result.length ? result.map((u: { id: number }) => u.id) : [-1];
    return this.questionRepository.findWithCount({
      where: { id: In(ids) }, relations: this.questionRelations,
    });
  }

  async getQuestionsByDislikedUser(user: User): Promise<[Question[], number]> {
    const result = await getRepository(Question)
      .query(
        'SELECT qdu.questions_id as id FROM question_disliked_users qdu where qdu.users_id = ?',
        [user.id],
      );
    const ids = result.length ? result.map((u: { id: number }) => u.id) : [-1];
    return this.questionRepository.findWithCount({
      where: { id: In(ids) }, relations: this.questionRelations,
    });
  }

  getQuestionById(id: number): Promise<Question | undefined> {
    return this.questionRepository.findById(id, { relations: this.questionRelations });
  }

  async getQuestions(
    take: number,
    skip: number,
    options: { lastId?: number, subject?: string, tags?: Tag[], language?: string },
  ): Promise<[Partial<Question>[], number]> {
    const questionQueryBuilder = new QueryHelper<Question>(Question, 'question');

    if (options.lastId) questionQueryBuilder.andWhere('question.id > :id', { id: options.lastId });
    if (options.subject) questionQueryBuilder.andWhere('question.subject LIKE :subject', { subject: `%${options.subject}%` });
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
    questionQueryBuilder.addRelation('question.comments', 'comments');
    questionQueryBuilder.take(take);
    questionQueryBuilder.skip(skip);
    // console.log(questionQueryBuilder.query);
    // console.log(questionQueryBuilder.params);
    const count = await questionQueryBuilder.count();
    const items = await questionQueryBuilder.getMany();

    return [
      items.map(item => ({ ...item, comments_count: item.comments.length, comments: undefined })),
      count,
    ];
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
