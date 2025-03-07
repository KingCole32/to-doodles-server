import dotenv from "dotenv";
import mysql, { PoolOptions } from "mysql2";

dotenv.config();

const poolOptions: PoolOptions = {
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DB,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}

const pool = mysql.createPool(poolOptions).promise();

export default pool;