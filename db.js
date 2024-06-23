const mysql = require("mysql");
const conn = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  database: "chat",
  charset: "utf8mb4",
});

module.exports.conn = conn;
