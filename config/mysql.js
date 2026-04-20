const mysql = require("mysql2/promise");

const mysqlHost = process.env.MYSQL_HOST || process.env.DB_HOST || "127.0.0.1";
const mysqlPort = Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306);
const mysqlUser = process.env.MYSQL_USER || process.env.DB_USER || "root";
const mysqlPassword =
  process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "";
const mysqlDatabase = process.env.MYSQL_DATABASE || process.env.DB_NAME || "auth_db";

const pool = mysql.createPool({
  host: mysqlHost,
  port: mysqlPort,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
  waitForConnections: true,
  connectionLimit: 10
});

const testMySqlConnection = async () => {
  const connection = await pool.getConnection();
  connection.release();
};

module.exports = {
  pool,
  testMySqlConnection
};
