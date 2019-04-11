import { UserRepository } from './../repositories/UserRepository';

export class UserService {

  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  create() { }

  update() { }

  delete() { }

  getUsers() { }

  getUserById() { }
}
