import { BadRequestError, BodyParam, JsonController, Post } from 'routing-controllers';
import { ExecutableLanguage, Executer } from '../utils/Executer/Executer';

@JsonController('/run')
export class ExecuteController {
  @Post()
  async execute(@BodyParam('code') text: string, @BodyParam('language') language: string) {
    const executable = ExecutableLanguage.getLanguageByString(language);
    if (!executable) throw new BadRequestError('Not Support Language');
    try {
      const result = await new Executer().execute(text, executable);
      return {
        result: result.join('\n'),
      };
    } catch (e) {
      throw new BadRequestError(e.join('\n'));
    }
  }
}
