import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Base } from './Base';
import { Comment } from './Comment';
import { Question } from './Question';
import { Tag } from './Tag';

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
  @OneToMany(_ => Question, question => question.user, { cascade: true })
  questions!: Question[];
  @OneToMany(_ => Comment, question => question.user, { cascade: true })
  comments!: Comment[];
  @ManyToMany(_ => Tag, tag => tag.taggedUsers, { cascade: true })
  @JoinTable()
  tags!: Tag[];
  @ManyToMany(_ => Question, question => question.likedUsers, { cascade: true })
  likedQuestions!: Question[];
  @ManyToMany(_ => Comment, comment => comment.likedUsers, { cascade: true })
  likedComments!: Comment[];
}
