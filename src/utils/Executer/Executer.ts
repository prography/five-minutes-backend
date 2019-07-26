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
        return 'c';
      case ExecutableLanguage.CPP:
        return 'cpp';
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
  private testName: string = 'test';
  private readonly timeout = 1000;

  private get sourceFilePath(): string {
    return `${this.dirPath}/${this.testName}.${this.type}`;
  }

  private get executableFilePath(): string {
    return `${this.dirPath}/${this.testName}`;
  }

  private get dirPath(): string {
    return `${__dirname}/${this.filename}`;
  }

  public async execute(text: string, type: ExecutableLanguage): Promise<string[]> {
    this.saveFile(text, ExecutableLanguage.getExecute(type));
    let result: string[] = [];
    try {
      switch (type) {
        case ExecutableLanguage.C:
        case ExecutableLanguage.CPP:
          result = await this.runC();
          break;
        case ExecutableLanguage.JAVA:
          result = await this.runJava();
          break;
        case ExecutableLanguage.PYTHON2:
          result = await this.runPython2();
          break;
        case ExecutableLanguage.PYTHON:
        case ExecutableLanguage.PYTHON3:
          result = await this.runPython3();
          break;
        case ExecutableLanguage.NODEJS:
        case ExecutableLanguage.JAVASCRIPT:
          result = await this.runNodeJs();
          break;
        case ExecutableLanguage.TYPESCRIPT:
          result = await this.runTypescript();
          break;
      }
    } catch (e) {
      throw e;
    } finally {
      this.removeFile();
      return result;
    }
  }

  private async runC() {
    let result: string[] = [];
    result = result.concat(await this.execSpawn('gcc', ['-o', this.executableFilePath, this.sourceFilePath]));
    result = result.concat(await this.execSpawn(`${this.executableFilePath}`, []));
    return result;
  }

  private async runJava() {
    let result: string[] = [];
    result = result.concat(await this.execSpawn('javac', [this.sourceFilePath], 5000));
    result = result.concat(await this.execSpawn('java', ['-cp', this.dirPath, this.testName]));
    return result;
  }

  private async runPython2() {
    const result = await this.execSpawn('python2', [this.sourceFilePath]);
    return result;
  }

  private async runPython3() {
    const result = await this.execSpawn('python3', [this.sourceFilePath]);
    return result;
  }

  private async runTypescript() {
    const result = await this.execSpawn('npx', ['ts-node', this.sourceFilePath], 5000);
    return result;
  }

  private async runNodeJs() {
    const result = await this.execSpawn('node', [this.sourceFilePath]);
    return result;
  }

  private execSpawn(command: string, options: string[], timeout: number = this.timeout): Promise<string[]> {
    console.log(`${command} ${options.join(' ')}`);
    return new Promise((resolve, reject) => {
      const result: string[] = [];
      const error: string[] = [];
      const spawn = childProcess.spawn(command, options);
      const forceQuit = setTimeout(() => { spawn.kill(); }, timeout);
      spawn.stderr.on('data', (data: Buffer) => {
        error.push(data.toString());
      });
      spawn.stdout.on('data', (data: Buffer) => {
        result.push(data.toString());
      });
      spawn.on('close', (code) => {
        console.log(`exit with code ${code}`);
        clearTimeout(forceQuit);
        if (error.length) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  private saveFile(text: string, type: string) {
    this.filename = AuthHelper.hash(text);
    this.type = type;
    this.removePath(this.dirPath);
    fs.mkdirSync(this.dirPath);
    if (type === 'java') {
      const searched = /public\s+class\s+\w+/g.exec(text);
      if (searched) {
        this.testName = searched[0].split(' ').slice(-1)[0];
      }
    }
    fs.writeFileSync(this.sourceFilePath, text, 'utf8');
  }

  private removeFile() {
    this.removePath(this.dirPath);
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
