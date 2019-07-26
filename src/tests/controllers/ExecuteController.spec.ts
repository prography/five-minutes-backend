import axios from 'axios';
import fs from 'fs';
import path from 'path';

const file = fs.readFileSync(path.join(`${__dirname}/../../utils/Executer/tests/test.c`));

// axios({
//   baseURL: 'localhost:3000',
//   method: 'GET',
// }).then(res => console.log(res))
//   .catch(e => console.error(e));

axios.post('localhost:3000/run/c', { code: file.toString() })
  .then((res) => {
    console.log(res);
    process.exit();
  });
