const express = require("express");
// requiring database
const conn = require("./db.js");
// acquiring cookie-parser
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const server = http.createServer(app);

// working on socket module
const { socket } = require("./socket.js");
const { log } = require("console");
const exp = require("constants");
// initializing socket
socket(server);
// using cookie parser
app.use(cookieParser);
app.set("view engine", "ejs");

app.use("/public", express.static("./public"));
// getting body parameters
app.use(express.urlencoded({ extended: false }));

// cookie parser

app.get("/", (req, res) => {
  res.render("index");
});

// provide register Page
app.get("/register", (req, res) => {
  res.render("register");
});

//sign-up process

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  res.send("sign up page");
});

server.listen(8000);

console.log(conn);
