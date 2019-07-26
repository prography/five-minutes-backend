import fs from 'fs';
import { ExecutableLanguage, Executer } from '../Executer';

const executer = new Executer();

test('Java compile and run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.java`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.JAVA);
  expect(output.join()).toEqual('Hello, World!\n');
});

test('C compile and run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.c`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.C);
  expect(output.join()).toEqual('Hello, World!\n');
});

test('Cpp compile and run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.cpp`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.CPP);
  expect(output.join()).toEqual('Hello, World!\n');
});

test('Python run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.py`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.PYTHON);
  expect(output.join()).toEqual('Hello, World!\n');
});

test('Python2 run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.py`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.PYTHON2);
  expect(output.join()).toEqual('Hello, World!\n');
});

test('Python3 run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.py`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.PYTHON3);
  expect(output.join()).toEqual('Hello, World!\n');
});

test('NodeJs run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.js`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.NODEJS);
  expect(output.join()).toEqual('Hello, World!\n');
});

test('Typescript compile and run', async () => {
  const text = fs.readFileSync(`${__dirname}/test.ts`, { encoding: 'utf8' });
  const output = await executer.execute(text, ExecutableLanguage.TYPESCRIPT);
  expect(output.join()).toEqual('Hello, World!\n');
});
