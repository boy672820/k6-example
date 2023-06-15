import mysql from 'mysql';
import { PoolConnection } from 'mysql';

export const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '672820',
  connectionLimit: 3,
  database: 'testdb',
});

export const getConnection: () => Promise<PoolConnection> = () =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);

      // Resolve에서 Connection 전달 후 자동으로 release
      resolve(connection);
    });
  });
