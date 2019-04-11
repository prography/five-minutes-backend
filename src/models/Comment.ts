import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentLike } from './CommentLike';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  content!: string;
  @ManyToOne(_ => Question, question => question.comments)
  question!: Question;
  @ManyToOne(_ => User, user => user.comments)
  user!: User;
  @Column()
  codeline!: number;
  @OneToMany(_ => CommentLike, commentLike => commentLike.comment)
  likedUsers!: CommentLike[];
}
