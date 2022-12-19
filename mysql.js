const mysqlDb = require('mysql');
require('dotenv').config();

const pool = mysqlDb.createPool({
  connectionLimit: 2,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

exports.sqlReady = false;
exports.mysql = mysqlDb;

pool.getConnection((err,connection) => {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
  this.sqlReady = true;
});

exports.sqlQuery = query => {
  return new Promise((resolve, reject) => {
    pool.query(query, (err, data) => {
      if(err) {
        reject(err);
        return;
      }
      resolve (data);
    })
  })
}

