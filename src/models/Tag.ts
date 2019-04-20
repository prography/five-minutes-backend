import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Base } from './Base';
import { QuestionTag } from './QuestionTag';
import { UserTag } from './UserTag';

@Entity()
@Unique(['name'])
export class Tag extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ length: 20 })
  name!: string;
  @Column({ length: 250 })
  description!: string;
  @ManyToMany(_ => QuestionTag, questionTag => questionTag.tag)
  taggedQuestions!: QuestionTag[];
  @ManyToMany(_ => UserTag, userTag => userTag.tag)
  taggedUsers!: UserTag[];
}
