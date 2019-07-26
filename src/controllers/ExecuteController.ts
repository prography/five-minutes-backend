import { BadRequestError, BodyParam, JsonController, Post } from 'routing-controllers';
import { ExecutableLanguage, Executer } from '../utils/Executer/Executer';
import { StorageHelper } from '../utils/StorageHelper';

@JsonController('/run')
export class ExecuteController {
  @Post()
  execute(@BodyParam('code') text: string, @BodyParam('language') language: string) {
    const executable = ExecutableLanguage.getLanguageByString(language);
    if (!executable) throw new BadRequestError('Not Support Language');
    const file = StorageHelper.readAndWrite(text);
    const result = new Executer().execute(file.toString(), executable);
    return {
      result,
    };
  }
}
