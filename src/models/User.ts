import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Comment } from './Comment';
import { CommentLike } from './CommentLike';
import { Question } from './Question';
import { QuestionLike } from './QuestionLike';
import { UserTag } from './UserTag';

@Entity()
export class User extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  email!: string;
  @Column()
  nickname!: string;
  @Column()
  password!: string;
  @Column()
  rank!: string;
  @Column({ nullable: true })
  verifiedAt!: Date;
  @Column()
  token!: string;
  @Column()
  githubUrl!: string;
  @Column()
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
