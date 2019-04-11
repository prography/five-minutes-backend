import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class QuestionLike {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(_ => User, user => user.likedQuestions)
  user!: User;
  @ManyToOne(_ => Question, question => question.likedUsers)
  question!: Question;
}
