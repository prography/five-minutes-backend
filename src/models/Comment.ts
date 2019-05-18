import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Question } from './Question';
import { User } from './User';

@Entity()
export class Comment extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'text' })
  content!: string;
  @Column({ length: 20 })
  type!: string;
  @Column({ length: 20 })
  status!: string;
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
