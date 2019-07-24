import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './Base';

@Entity({ orderBy: { duration: 'ASC' } })
export class Honor extends Base {
  @PrimaryGeneratedColumn()
  id!: number;
  // 이름
  @Column()
  name!: string;
  // 메일
  @Column()
  mail!: string;
  // 메일 받을 것인지 여부
  @Column()
  agreeReceivingMail!: boolean;
  // 시간 초
  @Column()
  duration!: number;
}
