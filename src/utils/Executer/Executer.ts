import * as childProcess from 'child_process';
import fs from 'fs';
import { AuthHelper } from '../AuthHelper';

export enum ExecutableFile {
  PYTHON2 = 'PYTHON2',
  PYTHON3 = 'PYTHON3',
  C = 'C',
  JAVA = 'JAVA',
}

export class Executer {
  private filename: string = '';
  private type: string = '';

  private get sourceFilePath(): string {
    return `${this.executableFilePath}.${this.type}`;
  }

  private get executableFilePath(): string {
    return `${__dirname}/${this.filename}`;
  }

  public execute(text: string, type: ExecutableFile) {
    this.saveFile(text, this.getExecute(type));
    let result = '';
    try {
      switch (type) {
        case ExecutableFile.C:
          result = this.runC();
          break;
        case ExecutableFile.JAVA:
          result = this.runJava();
          break;
        case ExecutableFile.PYTHON2:
          result = this.runPython2();
          break;
        case ExecutableFile.PYTHON3:
          result = this.runPython3();
          break;
      }
    } catch (e) {
      console.error('error', e);
    } finally {
      this.removeFile();
      return result;
    }
  }

  private getExecute(type: ExecutableFile): string {
    switch (type) {
      case ExecutableFile.C:
        return 'c';
      case ExecutableFile.JAVA:
        return 'java';
      case ExecutableFile.PYTHON2:
      case ExecutableFile.PYTHON3:
        return 'py';
    }
  }

  private runC() {
    childProcess.execSync(`gcc -o ${this.executableFilePath} ${this.sourceFilePath}`);
    const result = childProcess.execSync(`${this.executableFilePath}`);
    return result.toString();
  }

  private runJava() {
    const filename = 'Main.java';
    fs.mkdirSync(this.executableFilePath);
    fs.copyFileSync(`${this.sourceFilePath}`, `${this.executableFilePath}/${filename}`);
    childProcess.execSync(`javac ${this.executableFilePath}/${filename}`);
    const files = fs.readdirSync(this.executableFilePath);
    const compiledFile = files.find(file => /\.class/.test(file) && file !== filename) || '';
    const result = childProcess.execSync(`java -cp ${this.executableFilePath} ${compiledFile.split('.')[0]}`);
    Executer.removeDir(this.executableFilePath);
    return result.toString();
  }

  private runPython2() {
    const result = childProcess.execSync(`python2 ${this.sourceFilePath}`);
    return result.toString();
  }

  private runPython3() {
    const result = childProcess.execSync(`python3 ${this.sourceFilePath}`);
    return result.toString();
  }

  private saveFile(text: string, type: string) {
    this.filename = AuthHelper.hash(text);
    this.type = type;
    fs.writeFileSync(`${this.sourceFilePath}`, text, 'utf8');
  }

  private removeFile() {
    if (fs.existsSync(this.executableFilePath)) {
      fs.unlinkSync(this.executableFilePath);
    }
    if (fs.existsSync(this.sourceFilePath)) {
      fs.unlinkSync(this.sourceFilePath);
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