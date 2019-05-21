import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Question } from './Question';
import { User } from './User';

export enum CommentStatus {
  WAIT = 'WAIT',
  PENDING = 'PENDING',
  RESOLVE = 'RESOLVE',
  REJECT = 'REJECT',
}
export enum CommentType {
  NORMAL = 'NORMAL',
  MODIFY = 'MODIFY',
}
@Entity()
export class Comment extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'text' })
  content!: string;
  @Column({ type: 'enum', enum: CommentType, default: CommentType.NORMAL })
  type!: CommentType;
  @Column({ type: 'enum', enum: CommentStatus, default: CommentStatus.WAIT })
  status!: CommentStatus;
  @ManyToOne(_ => Question, question => question.comments)
  question!: Question;
  @ManyToOne(_ => User, user => user.comments)
  user!: User;
  @Column()
  codeline!: number;
  @ManyToMany(_ => User, user => user.likedComments)
  @JoinTable()
  likedUsers!: User[];
}
