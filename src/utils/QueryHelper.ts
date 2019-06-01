import { EntitySchema, getRepository, SelectQueryBuilder } from 'typeorm';

export class QueryHelper<T> {
  private queryBuilder: SelectQueryBuilder<T>;
  // private tableName: string;
  private isFirstWhere: boolean = true;

  constructor(entityName: Function | EntitySchema<T>, tableName: string) {
    this.queryBuilder = getRepository(entityName)
      .createQueryBuilder(tableName);
    // this.tableName = tableName;
  }

  select(columnName: string, alias: string) {
    this.queryBuilder.select(columnName, alias);
  }

  setParameter(key: string, value: any) {
    this.queryBuilder.setParameter(key, value);
  }

  andWhere(query: string, params?: any) {
    if (this.isFirstWhere) {
      this.queryBuilder.where(query, params);
    } else {
      this.queryBuilder.andWhere(query, params);
    }
  }

  orWhere(query: string, params?: any) {
    if (this.isFirstWhere) {
      this.queryBuilder.where(query, params);
    } else {
      this.queryBuilder.orWhere(query, params);
    }
  }

  skip(skip: number) {
    this.queryBuilder.skip(skip);
  }

  take(take: number) {
    this.queryBuilder.take(take);
  }

  addRelation(entity: string, name: string, condition?: string, parameters?: any) {
    this.queryBuilder.leftJoinAndSelect(entity, name, condition, parameters);
  }

  getOne() {
    return this.queryBuilder.getOne();
  }

  getMany() {
    return this.queryBuilder.getMany();
  }

  count() {
    return this.queryBuilder.getCount();
  }

  get query() {
    return this.queryBuilder.getQuery();
  }

  get params() {
    return this.queryBuilder.getParameters();
  }

}
