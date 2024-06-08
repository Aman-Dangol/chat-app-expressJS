const express = require("express");
// requiring database
const { conn } = require("./db");
// acquiring cookie-parser
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);

// working on socket module
const { socket } = require("./socket.js");
// initializing socket
socket(server);
// using cookie parser
app.use(cookieParser());

// setting view engine to ejs
app.set("view engine", "ejs");

app.use("/public", express.static("./public"));

// getting body parameters
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

// provide register Page
app.get("/register", (req, res) => {
  res.render("register");
});

//sign-up process

app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  conn.query(
    `insert into users(username,email,password) values('${username}','${email}','${password}')`
  );
  res.redirect("/login");
});

//provide login page
app.get("/login", (req, res) => {
  res.render("login");
});
server.listen(8000);
