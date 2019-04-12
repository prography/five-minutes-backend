import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';
import { Tag } from './Tag';
import { User } from './User';

@Entity()
export class UserTag extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(_ => Tag, tag => tag.taggedUsers)
  tag!: Tag;
  @ManyToOne(_ => User, user => user.tags)
  user!: User;
}
