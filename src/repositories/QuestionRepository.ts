import { EntityRepository } from 'typeorm';
import { Question } from '../models/Question';
import { BaseRepository } from './base/BaseRepository';

@EntityRepository(Question)
export class QuestionRepository extends BaseRepository<Question> {}
