import { Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Param, Post, UseInterceptor } from 'routing-controllers';
import { UserCreateDto } from '../Dto/UserCreateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { User } from '../models/User';
import { UserService } from '../services/UserService';

@JsonController()
export class AuthController {

  @Post('/sign-in')
  @UseInterceptor(EntityInterceptor)
  async signIn(
    @BodyParam('email', { required: true, validate: true }) email: string,
    @BodyParam('password', { required: true, validate: true }) password: string,
  ) {
    const user = await new UserService().signIn(email, password);
    return {
      ...user,
      password: undefined,
    };
  }

  @Post('/sign-up')
  @UseInterceptor(EntityInterceptor)
  async signUp(@Body({ required: true, validate: true }) userForm: UserCreateDto) {
    const user = await new UserService().signUp(userForm);
    return {
      ...user,
      password: undefined,
    };
  }

  @Authorized()
  @Get('/sign-out')
  @UseInterceptor(EntityInterceptor)
  signOut() {
    return {
      result: `sign out successfully`,
    };
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
