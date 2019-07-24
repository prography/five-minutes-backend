import fs from 'fs';
import { ExecutableFile, Executer } from '../Executer';

const executer = new Executer();

test('Java compile and run', () => {
  const text = fs.readFileSync(`${__dirname}/test.java`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableFile.JAVA);
  expect(output).toEqual('Hello, World!\n');
});

test('C compile and run', () => {
  const text = fs.readFileSync(`${__dirname}/test.c`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableFile.C);
  expect(output).toEqual('Hello, World!\n');
});

test('Python2 compile and run', () => {
  const text = fs.readFileSync(`${__dirname}/test.py`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableFile.PYTHON2);
  expect(output).toEqual('Hello, World!\n');
});

test('Python3 compile and run', () => {
  const text = fs.readFileSync(`${__dirname}/test.py`, { encoding: 'utf8' });
  const output = executer.execute(text, ExecutableFile.PYTHON3);
  expect(output).toEqual('Hello, World!\n');
});
