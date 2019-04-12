import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Question } from './Question';
import { Tag } from './Tag';

@Entity()
export class QuestionTag extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(_ => Tag, tag => tag.taggedQuestions)
  tag!: Tag;
  @ManyToOne(_ => Question, question => question.tags)
  question!: Question;
}
