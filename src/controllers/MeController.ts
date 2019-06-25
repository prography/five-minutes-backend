import { Authorized, CurrentUser, Get, JsonController, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { QuestionPaginationInterceptor } from '../interceptors/QuestionPaginationInterceptor';
import { User } from '../models/User';
import { CommentService } from '../services/CommentService';
import { QuestionService } from '../services/QuestionService';

@Authorized()
@JsonController('/me')
export class MeController {

  @Get()
  @UseInterceptor(EntityInterceptor)
  getMe(@CurrentUser({ required: true }) user: User) {
    return {
      ...user,
      password: undefined,
    };
  }

  @Get('/comments')
  async getMyComments(@CurrentUser({ required: true }) user: User) {
    const [items, totalCount] = await new CommentService().getCommentsByUser(user);
    return {
      items,
      totalCount,
    };
  }

  @Get('/questions')
  @UseInterceptor(QuestionPaginationInterceptor)
  async getMyQuestions(@CurrentUser({ required: true }) user: User) {
    const [items, totalCount] = await new QuestionService().getQuestionsByUser(user);
    return {
      items,
      totalCount,
    };
  }

  @Get('/liked-comments')
  async getMyLikedComments(@CurrentUser({ required: true }) user: User) {
    const [items, totalCount] = await new CommentService().getCommentsByLikedUser(user);
    return {
      items,
      totalCount,
    };
  }

  @Get('/liked-questions')
  @UseInterceptor(QuestionPaginationInterceptor)
  async getMyLikedQuestions(@CurrentUser({ required: true }) user: User) {
    const [items, totalCount] = await new QuestionService().getQuestionsByLikedUser(user);
    return {
      items,
      totalCount,
    };
  }
}
