import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Comment } from './Comment';
import { Tag } from './Tag';
import { User } from './User';

@Entity()
export class Question extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ length: 50 })
  subject!: string;
  @Column({ type: 'text' })
  content!: string;
  @Column({ length: 20 })
  language!: string;
  @Column({ type: 'text' })
  code!: string;
  @ManyToOne(_ => User)
  user!: User;
  @ManyToMany(_ => User, user => user.likedQuestions)
  @JoinTable()
  likedUsers!: User[];
  @OneToMany(_ => Comment, comment => comment.question, { cascade: true })
  comments!: Comment[];
  @ManyToMany(_ => Tag, tag => tag.taggedQuestions)
  @JoinTable()
  tags!: Tag[];
}
