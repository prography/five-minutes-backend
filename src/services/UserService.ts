import { User } from '../models/User';
import { UserRepository } from './../repositories/UserRepository';

export class UserService {

  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  create() { }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  delete() { }

  getUsers() { }

  getUserById() { }
}
