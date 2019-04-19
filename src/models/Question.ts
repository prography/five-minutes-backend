import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Comment } from './Comment';
import { QuestionLike } from './QuestionLike';
import { QuestionTag } from './QuestionTag';
import { User } from './User';

@Entity()
export class Question extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ length: 50 })
  subject!: string;
  @Column({ length: 200 })
  content!: string;
  @Column({ type: 'text' })
  code!: string;
  @ManyToOne(_ => User)
  user!: User;
  @OneToMany(_ => QuestionLike, questionLike => questionLike.question, { cascade: true })
  likedUsers!: QuestionLike[];
  @OneToMany(_ => Comment, comment => comment.question, { cascade: true })
  comments!: Comment[];
  @OneToMany(_ => QuestionTag, questionTag => questionTag.question, { cascade: true })
  tags!: QuestionTag[];
}
