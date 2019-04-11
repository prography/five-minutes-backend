import { Tag } from '../models/Tag';
import { BaseRepository } from './base/BaseRepository';

export class TagRepository extends BaseRepository<Tag> {
  constructor() {
    super(Tag);
  }
}
