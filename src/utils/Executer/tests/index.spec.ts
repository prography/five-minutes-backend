import fs from 'fs';
import { ExecutableLanguage, Executer } from '../Executer';

const executer = new Executer();

test('Java compile and run', () => {
  const text = fs.readFileSync(`${__dirname}/test.java`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableLanguage.JAVA);
  expect(output).toEqual('Hello, World!\n');
});

test('C compile and run', () => {
  const text = fs.readFileSync(`${__dirname}/test.c`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableLanguage.C);
  expect(output).toEqual('Hello, World!\n');
});

test('Python2 run', () => {
  const text = fs.readFileSync(`${__dirname}/test.py`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableLanguage.PYTHON2);
  expect(output).toEqual('Hello, World!\n');
});

test('Python3 run', () => {
  const text = fs.readFileSync(`${__dirname}/test.py`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableLanguage.PYTHON3);
  expect(output).toEqual('Hello, World!\n');
});

test('NodeJs run', () => {
  const text = fs.readFileSync(`${__dirname}/test.js`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableLanguage.NODEJS);
  expect(output).toEqual('Hello, World!\n');
});

test('Typescript compile and run', () => {
  const text = fs.readFileSync(`${__dirname}/test.ts`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableLanguage.TYPESCRIPT);
  expect(output).toEqual('Hello, World!\n');
});
