import { getConnection } from 'typeorm';
import { connect } from './database';

connect().then(() => {
  getConnection().synchronize();
  process.exit();
});
