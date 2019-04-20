import { DeleteResult, FindConditions } from 'typeorm';
import { User } from '../models/User';
import { UserRepository } from './../repositories/UserRepository';

export class UserService {

  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  create(email: string, nickname: string, password: string, githubUrl: string): Promise<User> {
    const newUser = new User();
    newUser.email = email;
    newUser.nickname = nickname;
    newUser.password = password;
    newUser.githubUrl = githubUrl;
    return this.userRepository.create(newUser);
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async getUsers(take: number, skip: number, where?: FindConditions<User>): Promise<[User[], number]> {
    const result = await this.userRepository.findWithCount({ take, skip, where });
    return result;
  }

  getUserById(id : number): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }
}
