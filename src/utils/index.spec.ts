// import { ObjectManager } from './ObjectManager';
import fs from 'fs';
import { Executer } from './Executer';
import { ExecutableLanguage } from './Executer/Executer';

// const a = {
//   a: 1,
//   b: 2,
//   c: 13,
//   d: [
//     { a: 1, b: 10 },
//     { a: 1, b: 10 },
//     { a: 1, b: 10 },
//     { a: 1, b: 10 },
//   ],
//   e: {
//     a: 13,
//     b: 12,
//     c: new Date(),
//   },
// };

// const deleteB = ObjectManager.deleteValuesByKeys(a, ['b']);

// console.log(deleteB);

const executer = new Executer();
const text = fs.readFileSync(`${__dirname}/test.java`, { encoding: 'utf8' });
const output = executer.execute(text, ExecutableLanguage.JAVA);
console.log(output);
