import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Base } from './Base';
import { Comment } from './Comment';
import { CommentLike } from './CommentLike';
import { Question } from './Question';
import { QuestionLike } from './QuestionLike';
import { UserTag } from './UserTag';

@Entity()
@Unique(['email'])
export class User extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ length: 50 })
  email!: string;
  @Column({ length: 10 })
  nickname!: string;
  @Column({ length: 20 })
  password!: string;
  @Column({ length: 10, nullable: true })
  rank!: string;
  @Column({ nullable: true })
  verifiedAt!: Date;
  @Column({ length: 50, nullable: true })
  token!: string;
  @Column({ length: 50, default: '' })
  githubUrl!: string;
  @Column({ length: 200, nullable: true })
  image!: string;
  @OneToMany(_ => Question, question => question.user)
  questions!: Question[];
  @OneToMany(_ => Comment, question => question.user)
  comments!: Comment[];
  @OneToMany(_ => UserTag, userTag => userTag.user)
  tags!: UserTag[];
  @ManyToMany(_ => QuestionLike, questionLike => questionLike.user)
  likedQuestions!: QuestionLike[];
  @ManyToMany(_ => CommentLike, commentLike => commentLike.user)
  likedComments!: CommentLike[];
}
