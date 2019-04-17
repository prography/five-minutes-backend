import { DeleteResult } from 'typeorm';
import { User } from '../models/User';
import { UserRepository } from './../repositories/UserRepository';

export class UserService {

  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  create(user: User): Promise<User> {
    const newUser = new User();
    newUser.email = user.email;
    newUser.nickname = user.nickname;
    newUser.password = user.password;
    newUser.rank = user.rank;
    newUser.verifiedAt = user.verifiedAt;
    newUser.token = user.token;
    newUser.githubUrl = user.githubUrl;
    newUser.image = user.image;
    return this.userRepository.create(user);
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async getUsers(email: string, nickname: string, rank: string): Promise<[User[], number]> {
    const result = await this.userRepository.findWithCount({ where: { email, nickname, rank } });
    return result;
  }

  getUserById(id : number): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }
}
