import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { QuestionTag } from './QuestionTag';
import { UserTag } from './UserTag';

@Entity()
export class Tag extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  description!: string;
  @ManyToMany(_ => QuestionTag, questionTag => questionTag.tag)
  taggedQuestions!: QuestionTag[];
  @ManyToMany(_ => UserTag, userTag => userTag.tag)
  taggedUsers!: UserTag[];
}
