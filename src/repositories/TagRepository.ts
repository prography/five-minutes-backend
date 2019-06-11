import { EntityRepository } from 'typeorm';
import { Tag } from '../models/Tag';
import { BaseRepository } from './base/BaseRepository';

@EntityRepository(Tag)
export class TagRepository extends BaseRepository<Tag> {}
