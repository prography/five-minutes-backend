import { Authorized, Body, BodyParam, CurrentUser, Get, JsonController, Param, Post, UseInterceptor } from 'routing-controllers';
import { UserCreateDto } from '../Dto/UserCreateDto';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { PaginationInterceptor } from '../interceptors/PaginationInterceptor';
import { User } from '../models/User';
import { CommentService } from '../services/CommentService';
import { QuestionService } from '../services/QuestionService';
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
    return `sign out successfully`;
  }

  @Get('/me')
  @UseInterceptor(EntityInterceptor)
  getMe(@CurrentUser({ required: true }) user: User) {
    return {
      ...user,
      password: undefined,
    };
  }

  @Get('/me/comments')
  async getMyComments(@CurrentUser({ required: true }) user: User) {
    return {
      items: await new CommentService().getCommentsByUser(user),
    };
  }

  @Get('/me/questions')
  async getMyQuestions(@CurrentUser({ required: true }) user: User) {
    return {
      items: await new QuestionService().getQuestionsByUser(user),
    };
  }

  @Get('/me/liked-comments')
  async getMyLikedComments(@CurrentUser({ required: true }) user: User) {
    return {
      items: await new CommentService().getCommentsByLikedUser(user),
    };
  }

  @Get('/me/liked-questions')
  @UseInterceptor(PaginationInterceptor)
  async getMyLikedQuestions(@CurrentUser({ required: true }) user: User) {
    return {
      items: await new QuestionService().getQuestionsByLikedUser(user),
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
