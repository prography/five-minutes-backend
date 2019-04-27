import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Base } from './Base';
import { Question } from './Question';
import { User } from './User';

@Entity()
@Unique(['name'])
export class Tag extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ length: 20 })
  name!: string;
  @Column({ length: 250 })
  description!: string;
  @ManyToMany(_ => Question, question => question.tags)
  taggedQuestions!: Question[];
  @ManyToMany(_ => User, user => user.tags)
  taggedUsers!: User[];
}
