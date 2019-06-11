import { Action, InterceptorInterface } from 'routing-controllers';
import { Question } from '../models/Question';
import { ObjectManager } from '../utils/ObjectManager';

export class QuestionInterceptor implements InterceptorInterface {

  intercept(_: Action, result: { items: Partial<Question>[] }) {
    return ObjectManager.deleteValuesByKeys(result, ['token', 'password']);
  }

}
