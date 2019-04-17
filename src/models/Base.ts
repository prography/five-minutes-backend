import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Base {

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

}
