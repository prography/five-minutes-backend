import { Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Param, Post, UseInterceptor } from 'routing-controllers';
import { UserCreateDto } from '../Dto/UserCreateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { User } from '../models/User';
import { UserService } from '../services/UserService';

@JsonController()
export class AuthController {

  @Post('/sign-in')
  @UseInterceptor(EntityInterceptor)
  signIn(
    @BodyParam('email', { required: true, validate: true }) email: string,
    @BodyParam('password', { required: true, validate: true }) password: string,
  ) {
    return new UserService().signIn(email, password);
  }

  @Post('/sign-up')
  @UseInterceptor(EntityInterceptor)
  signUp(@Body({ required: true, validate: true }) userForm: UserCreateDto) {
    return new UserService().signUp(userForm);
  }

  @Authorized()
  @Get('/sign-out')
  @UseInterceptor(EntityInterceptor)
  signOut() {
    return `sign out successfully`;
  }

  @Get('/me')
  @UseInterceptor(EntityInterceptor)
  getMe(@CurrentUser({ required: true }) user: User) {
    return user;
  }

  // 토큰으로 내 정보 호출
  @Get('/user-by-token/:token')
  @UseInterceptor(EntityInterceptor)
  getUserByToken(@CurrentUser({ required: true }) _: User, @Param('token') token: string) {
    return new UserService().getUserByToken(token);
  }

  // 토큰에서 정보를 추출한다. 특수한 경우에만 사용
  // @Get('/info-from-token/:token')
  // @UseInterceptor(EntityInterceptor)
  // getInfoFromToken(@Param('token') token: string) {
  //   return AuthHelper.extract(token);
  // }

}
