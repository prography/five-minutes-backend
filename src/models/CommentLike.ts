import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './Comment';
import { User } from './User';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToMany(_ => User, user => user.likedComments)
  user!: User;
  @ManyToMany(_ => Comment, comment => comment.likedUsers)
  comment!: Comment;
}
