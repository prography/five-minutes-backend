import * as childProcess from 'child_process';
import fs from 'fs';
import { AuthHelper } from '../AuthHelper';

export enum ExecutableLanguage {
  PYTHON = 'python',
  PYTHON2 = 'python2',
  PYTHON3 = 'python3',
  C = 'c',
  CPP = 'c++',
  JAVA = 'java',
  NODEJS = 'nodejs',
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
}

export module ExecutableLanguage {
  export function getExecutableLanguages(): ExecutableLanguage[] {
    return [
      ExecutableLanguage.C,
      ExecutableLanguage.CPP,
      ExecutableLanguage.JAVA,
      ExecutableLanguage.PYTHON,
      ExecutableLanguage.PYTHON2,
      ExecutableLanguage.PYTHON3,
      ExecutableLanguage.NODEJS,
      ExecutableLanguage.JAVASCRIPT,
      ExecutableLanguage.TYPESCRIPT,
    ];
  }
  export function getLanguageByString(language: string): ExecutableLanguage | undefined {
    return ExecutableLanguage.getExecutableLanguages().find(lang => lang === language.toLowerCase());
  }
  export function getExecute(type: ExecutableLanguage): string {
    switch (type) {
      case ExecutableLanguage.C:
      case ExecutableLanguage.CPP:
        return 'c';
      case ExecutableLanguage.JAVA:
        return 'java';
      case ExecutableLanguage.PYTHON:
      case ExecutableLanguage.PYTHON2:
      case ExecutableLanguage.PYTHON3:
        return 'py';
      case ExecutableLanguage.NODEJS:
      case ExecutableLanguage.JAVASCRIPT:
        return 'js';
      case ExecutableLanguage.TYPESCRIPT:
        return 'ts';
    }
  }
}

export class Executer {
  private filename: string = '';
  private type: string = '';

  private get sourceFilePath(): string {
    return `${this.ExecutableLanguagePath}.${this.type}`;
  }

  private get ExecutableLanguagePath(): string {
    return `${__dirname}/${this.filename}`;
  }

  public execute(text: string, type: ExecutableLanguage): string | any {
    this.saveFile(text, ExecutableLanguage.getExecute(type));
    let result = '';
    try {
      switch (type) {
        case ExecutableLanguage.C:
        case ExecutableLanguage.CPP:
          result = this.runC();
          break;
        case ExecutableLanguage.JAVA:
          result = this.runJava();
          break;
        case ExecutableLanguage.PYTHON2:
          result = this.runPython2();
          break;
        case ExecutableLanguage.PYTHON:
        case ExecutableLanguage.PYTHON3:
          result = this.runPython3();
          break;
        case ExecutableLanguage.NODEJS:
        case ExecutableLanguage.JAVASCRIPT:
          result = this.runNodeJs();
          break;
        case ExecutableLanguage.TYPESCRIPT:
          result = this.runTypescript();
          break;
      }
    } catch (e) {
      result = e;
    } finally {
      this.removeFile();
      return result;
    }
  }

  private runC() {
    childProcess.execSync(`gcc -o ${this.ExecutableLanguagePath} ${this.sourceFilePath}`);
    const result = childProcess.execSync(`${this.ExecutableLanguagePath}`, { timeout: 10000 });
    return result.toString();
  }

  private runJava() {
    const filename = 'Main.java';
    fs.mkdirSync(this.ExecutableLanguagePath);
    fs.copyFileSync(`${this.sourceFilePath}`, `${this.ExecutableLanguagePath}/${filename}`);
    childProcess.execSync(`javac ${this.ExecutableLanguagePath}/${filename}`);
    const files = fs.readdirSync(this.ExecutableLanguagePath);
    const compiledFile = files.find(file => /\.class/.test(file) && file !== filename) || '';
    const result = childProcess.execSync(`java -cp ${this.ExecutableLanguagePath} ${compiledFile.split('.')[0]}`, {
      timeout: 10000 });
    Executer.removeDir(this.ExecutableLanguagePath);
    return result.toString();
  }

  private runPython2() {
    const result = childProcess.execSync(`python2 ${this.sourceFilePath}`, { timeout: 10000 });
    return result.toString();
  }

  private runPython3() {
    const result = childProcess.execSync(`python3 ${this.sourceFilePath}`, { timeout: 10000 });
    return result.toString();
  }

  private runTypescript() {
    const result = childProcess.execSync(`npx ts-node ${this.sourceFilePath}`, { timeout: 10000 });
    return result.toString();
  }

  private runNodeJs() {
    const result = childProcess.execSync(`node ${this.sourceFilePath}`, { timeout: 10000 });
    return result.toString();
  }

  private saveFile(text: string, type: string) {
    this.filename = AuthHelper.hash(text);
    this.type = type;
    fs.writeFileSync(`${this.sourceFilePath}`, text, 'utf8');
  }

  private removeFile() {
    this.removePath(this.ExecutableLanguagePath);
    this.removePath(this.sourceFilePath);
  }

  private removePath(path: string) {
    if (fs.existsSync(path)) {
      if (fs.lstatSync(path).isDirectory()) {
        Executer.removeDir(path);
      } else {
        fs.unlinkSync(path);
      }
    }
  }

  private static removeDir(path: string) {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path);
      files.forEach(file => fs.unlinkSync(`${path}/${file}`));
      fs.rmdirSync(path);
    }
  }
}
