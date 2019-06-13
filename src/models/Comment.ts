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
@Entity({ orderBy: { createdAt: 'ASC' } })
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
  @Column({ length: 200 })
  codestring!: string;
  @ManyToMany(_ => User, user => user.likedComments)
  @JoinTable({ name: 'comment_liked_users' })
  likedUsers!: User[];

  @ManyToMany(_ => User, user => user.dislikedComments)
  @JoinTable({ name: 'comment_disliked_users' })
  dislikedUsers!: User[];

  get likedUsersCount(): number {
    return this.likedUsers.length;
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

  getLikedUserById(id: number): User | undefined {
    return this.likedUsers.find(likedUser => likedUser.id === id);
  }

}
