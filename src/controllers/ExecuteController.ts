import { BadRequestError, BodyParam, JsonController, Post } from 'routing-controllers';
import { ExecutableLanguage, Executer } from '../utils/Executer/Executer';

@JsonController('/run')
export class ExecuteController {
  @Post()
  execute(@BodyParam('code') text: string, @BodyParam('language') language: string) {
    const executable = ExecutableLanguage.getLanguageByString(language);
    if (!executable) throw new BadRequestError('Not Support Language');
    const result = new Executer().execute(text, executable);
    if (typeof result !== 'string') {
      throw new BadRequestError(result.output.map((buf: Buffer) => (buf || '').toString()).join('\n'));
    }
    return {
      result,
    };
  }
}
