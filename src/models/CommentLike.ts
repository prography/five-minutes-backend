import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Comment } from './Comment';
import { User } from './User';

@Entity()
export class CommentLike extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToMany(_ => User, user => user.likedComments)
  user!: User;
  @ManyToMany(_ => Comment, comment => comment.likedUsers)
  comment!: Comment;
}
