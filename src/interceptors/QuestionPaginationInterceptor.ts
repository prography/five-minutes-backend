import { Action, InterceptorInterface } from 'routing-controllers';
import { Question } from '../models/Question';
import { MarkdownCompiler } from '../utils/MarkdownCompiler';

export class QuestionPaginationInterceptor implements InterceptorInterface {

  intercept(_: Action, result: { items: (Partial<Question> & { summary?: string })[] }) {
    result.items = result.items.map(item => ({
      ...item,
      summary: MarkdownCompiler.compile(item.content || '', { length: 80 }),
    }));
    return {
      result,
    };
  }

}
