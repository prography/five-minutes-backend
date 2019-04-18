import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import DatabaseNamingStrategy from './utils/DatabaseNamingStrategy';

export async function connect() {
  // 환경변수에 등록되어 있는 ConnectionOptions 호출
  return getConnectionOptions().then((options: ConnectionOptions) => {
    // ConnectionOptions로 connection 생성
    return createConnection({
      ...<MysqlConnectionOptions>options,
      namingStrategy: new DatabaseNamingStrategy(),
      charset: 'utf8mb4',
    });
  });
}
