import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Comment } from './Comment';
import { Tag } from './Tag';
import { User } from './User';

export enum QuestionStatus {
  PENDING = 'PENDING',
  RESOLVE = 'RESOLVE',
}
@Entity({ orderBy: { createdAt: 'DESC' } })
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
  @Column({ type: 'enum', enum: QuestionStatus, default: QuestionStatus.PENDING })
  status!: QuestionStatus;
  @ManyToOne(_ => User)
  user!: User;
  @ManyToMany(_ => User, user => user.likedQuestions)
  @JoinTable({ name: 'question_liked_users' })
  likedUsers!: User[];
  @ManyToMany(_ => User, user => user.dislikedQuestions)
  @JoinTable({ name: 'question_disliked_users' })
  dislikedUsers!: User[];

  @OneToMany(_ => Comment, comment => comment.question, { cascade: true })
  comments!: Comment[];
  @ManyToMany(_ => Tag, tag => tag.taggedQuestions)
  @JoinTable({ name: 'question_tags' })
  tags!: Tag[];

  get tagNames(): string[] {
    return this.tags.map(tag => tag.name);
  }

  get namesOfLikedUsers(): string[] {
    return this.likedUsers.map(user => user.nickname);
  }

  get idsOfLikedUsers(): number[] {
    return this.likedUsers.map(user => user.id);
  }

  get idsOfDislikedUsers(): number[] {
    return this.dislikedUsers.map(user => user.id);
  }

  isLikedUser(user: User): boolean {
    return this.idsOfLikedUsers.includes(user.id);
  }

  isDislikedUser(user: User): boolean {
    return this.idsOfDislikedUsers.includes(user.id);
  }

  hasTag(tag: Tag):boolean {
    return this.tagNames.includes(tag.name);
  }
}
