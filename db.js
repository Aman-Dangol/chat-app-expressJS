const mysql = require("mysql");
const conn = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  database: "chat",
});

module.exports.conn = conn;
