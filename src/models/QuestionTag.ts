import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './Question';
import { Tag } from './Tag';

@Entity()
export class QuestionTag {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(_ => Tag, tag => tag.taggedQuestions)
  tag!: Tag;
  @ManyToOne(_ => Question, question => question.tags)
  question!: Question;
}
