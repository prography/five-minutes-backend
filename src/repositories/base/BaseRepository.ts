import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, getRepository, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T> {

  private repository: Repository<T>;

  constructor(model: any) {
    this.repository = getRepository(model);
  }

  // 생성
  async create(item: DeepPartial<T>): Promise<T> {
    return this.repository.save(item);
  }

  // 수정
  async update(id: string | number, item: QueryDeepPartialEntity<T>): Promise<T> {
    await this.repository.update(id, item);
    return <Promise<T>>this.repository.findOne(id);
  }

  // 증가
  async increment(where: FindConditions<T>, field: string, amount: number): Promise<T> {
    // increment
    await this.repository.increment(where, field, amount);
    return <Promise<T>>this.repository.findOne(where);
  }

  // 감소
  async decrement(where: FindConditions<T>, field: string, amount: number): Promise<T> {
    // decrement
    await this.repository.decrement(where, field, amount);
    return <Promise<T>>this.repository.findOne(where);
  }

  // 없으면 생성, 있으면 수정
  async upsert(item: DeepPartial<T>): Promise<T> {
    return this.repository.save(item);
  }

  // 삭제
  async delete(id: string | number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  // ID로 찾기
  async findById(id: string | number, options?: FindOneOptions<T>): Promise<T | undefined> {
    return !id ? undefined : this.repository.findOne(id, options);
  }

  // query로 찾기
  async findOne(options: FindOneOptions<T>): Promise<T | undefined> {
    return this.repository.findOne(options);
  }

  // query로 목록 가져오기
  async find(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  // query로 목록과 숫자 가져오기
  async findWithCount(options: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }
}
