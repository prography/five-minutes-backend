import { Question } from '../models/Question';
import { QuestionRepository } from '../repositories/QuestionRepository';

export class QuestionService {

  private questionRepository: QuestionRepository;

  constructor() {
    this.questionRepository = new QuestionRepository();
  }

  create() {}

  update() {}

  getQuestions() {}

  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questionRepository.findById(id);
  }

  countLikes() {}

  addTag() {}

  removeTag() {}

  delete() {}

  getLikedQuestions() {}

  getQuestionsByTags() {}

  likeQuestion() {}

}
