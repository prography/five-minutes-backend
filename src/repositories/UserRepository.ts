import { User } from '../models/User';
import { BaseRepository } from './base/BaseRepository';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}
