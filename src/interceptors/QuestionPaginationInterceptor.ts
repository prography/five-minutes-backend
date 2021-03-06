import { Action, InterceptorInterface } from 'routing-controllers';
import { Question } from '../models/Question';
import { MarkdownCompiler } from '../utils/MarkdownCompiler';
import { ObjectManager } from '../utils/ObjectManager';

export class QuestionPaginationInterceptor implements InterceptorInterface {

  intercept(_: Action, result: { items: Partial<Question>[] }) {
    result.items = result.items.map(item => ({
      ...item,
      content: MarkdownCompiler.compile(item.content || '', { length: 80 }),
    }));
    return ObjectManager.deleteValuesByKeys(result, ['token', 'password']);
  }

}
