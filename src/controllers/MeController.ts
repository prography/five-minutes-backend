import { Authorized, CurrentUser, Get, JsonController, QueryParam, UseInterceptor } from 'routing-controllers';
import { EntityInterceptor } from '../interceptors/EntityInterceptor';
import { QuestionPaginationInterceptor } from '../interceptors/QuestionPaginationInterceptor';
import { User } from '../models/User';
import { CommentService } from '../services/CommentService';
import { QuestionService } from '../services/QuestionService';
import { TagService } from '../services/TagService';

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
  async getMyQuestions(
    @CurrentUser({ required: true }) user: User,
    @QueryParam('page', { required: true }) page: number,
    @QueryParam('perPage', { required: true }) perPage: number,
    @QueryParam('lastId') lastId?: number,
    @QueryParam('subject') subject?: string,
    @QueryParam('language') language?: string,
    @QueryParam('tags') tagNames?: string[],
  ) {
    const tags = await new TagService().getOrCreateByNames(tagNames || []);
    const [items, totalCount] = await new QuestionService().getQuestions(
      perPage, (page - 1) * perPage, { lastId, subject, language, tags, userId: user.id });
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
