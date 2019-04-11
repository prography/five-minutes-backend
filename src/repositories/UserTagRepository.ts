import { UserTag } from '../models/UserTag';
import { BaseRepository } from './base/BaseRepository';

export class UserTagRepository extends BaseRepository<UserTag> {
  constructor() {
    super(UserTag);
  }
}
