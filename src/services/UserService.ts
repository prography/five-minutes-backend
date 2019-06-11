import { DeleteResult, FindConditions } from 'typeorm';
import { UserCreateDto } from '../Dto/UserCreateDto';
import { UserUpdateDto } from '../Dto/UserUpdateDto';
import { Tag } from '../models/Tag';
import { User } from '../models/User';
import { AuthHelper } from '../utils/AuthHelper';
import { UserRepository } from './../repositories/UserRepository';

export class UserService {

  private userRepository: UserRepository;

  private userRelations = ['tags'];

  constructor() {
    this.userRepository = new UserRepository();
  }

  async update(id: number, userForm: UserUpdateDto, tags: Tag[]) {
    if (userForm.password !== userForm.passwordConfirmation) throw Error('PASSWORD_IS_WRONG');
    const newUser = await this.userRepository.findById(id, { relations: ['tags'] });
    if (!newUser) throw Error('NO_USER');
    if (tags.length) newUser.tags = tags;
    if (!!userForm.githubUrl) newUser.githubUrl = userForm.githubUrl;
    if (!!userForm.nickname) newUser.nickname = userForm.nickname;
    if (!!userForm.image) newUser.image = userForm.image;
    return this.userRepository.save(newUser);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async getUsers(take: number, skip: number, where?: FindConditions<User>): Promise<[User[], number]> {
    const result = await this.userRepository.findWithCount({ take, skip, where, relations: this.userRelations });
    return result;
  }

  getUserById(id : number): Promise<User | undefined> {
    return this.userRepository.findById(id, { relations: this.userRelations });
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email }, relations: this.userRelations });
  }

  getUserByToken(token: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { token }, relations: this.userRelations });
  }

  // 인증관련
  /**
   * 로그인
   */
  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, password: AuthHelper.hash(password) },
    });
    // 이메일 또는 패스워드 불일치
    if (!user) throw Error('DOES_NOT_EXIST');
    // 로그인 성공시 token 생성 후 갱신
    const token = AuthHelper.generate({ email, rank: user.rank });
    return this.userRepository.updateAndGet(user.id, { token }, { relations: this.userRelations });
  }

  /**
   * 회원가입
   */
  async signUp(userForm: UserCreateDto, tags: Tag[]): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { email: userForm.email },
    });
    // 이미 같은 이메일 존재
    if (!!user) throw Error('DUPLICATE_USER');
    // 패스워드 확인 불일치
    if (userForm.password !== userForm.passwordConfirmation) throw Error('PASSWORDS_ARE_NOT_EQUAL');
    return this.userRepository.save({
      tags,
      email: userForm.email,
      password: AuthHelper.hash(userForm.password),
      nickname: userForm.nickname,
      githubUrl: userForm.githubUrl,
      image: userForm.image,
    });
  }

  /**
   * 비밀번호 찾기
   */
  async findPassword(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) throw Error('DOES_NOT_EXIST');
    // TODO: 어떤 결과 값을 주어야할지 논의 필요!
    return {};
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(userId: number, password: string, passwordConfirmation: string): Promise<User | undefined> {
    if (password !== passwordConfirmation) throw Error('PASSWORDS_ARE_NOT_EQUAL');
    return this.userRepository.updateAndGet(userId, {
      password,
    });
  }

  addTag(user: User, tag: Tag) {
    if (user.tagNames.includes(tag.name)) throw Error('ALREADY_EXIST');
    user.tags.push(tag);
    return this.userRepository.save(user);
  }

  removeTag(user: User, tag: Tag) {
    if (!user.tagNames.includes(tag.name)) throw Error('DOES_NOT_TAGGED');
    user.tags.splice(user.tagNames.indexOf(tag.name), 1);
    return this.userRepository.save(user);
  }
}
