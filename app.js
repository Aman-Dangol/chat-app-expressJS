const express = require("express");
// requiring database
const { conn } = require("./db");
// acquiring cookie-parser
const cookieParser = require("cookie-parser");
const app = express();
// acquiring authentication
const { auth } = require("./auth.js");
const http = require("http");
const server = http.createServer(app);
// importing expiry date calculator

const { expDate } = require("./getExpirydate.js");

// working on socket module
const { socket } = require("./socket.js");
const { log } = require("console");
// initializing socket
socket(server);
// using cookie parser
app.use(cookieParser());
app.use("/public", express.static("./public"));

// using auth
app.use(/^\/(?!login$|signup$|signin$|register$).*$/, auth);

// setting view engine to ejs
app.set("view engine", "ejs");

// getting body parameters
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  let { uid } = req.cookies;
  console.log("main", uid);
  conn.query(
    `select * from users where users.id =${uid}`,
    (err, data, field) => {
      if (err) {
        console.log("error in index rendering");
        return;
      }
      res.render("index", { user: data[0].username });
    }
  );
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
    `insert into users(username,email,password) values('${username}','${email}','${password}')`,
    (err) => {
      if (err) {
        res.send("email is already taken");
        return;
      }
      res.redirect("/login");
    }
  );
});

//provide login page
app.get("/login", (req, res) => {
  res.render("login");
});

// signin process

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  conn.query(
    `select * from users where users.email = '${email}'`,
    (err, data, field) => {
      if (err) {
        res.send("err");
      }
      if (!data.length) {
        res.send("email not found");
        return;
      }
      if (data[0].password != password) {
        res.send("email or psaswors incorrect");
        return;
      }

      res.cookie("uid", data[0].id, {
        expires: expDate(),
      });
      res.redirect("/");
    }
  );
});

// logout
app.get("/logout", (req, res) => {
  res.cookie("uid", "");
  res.redirect("/");
});

// getfriends
app.get("/getfriends", (req, res) => {
  let { uid } = req.cookies;
  conn.query(
    `select friends.friendID,users.username from friends join users on friends.friendID = users.id where userID =${uid} ;`,
    (err, data) => {
      if (err) {
        console.log("err");
        return;
      }
      res.render("friends", { data });
    }
  );
});

app.post("/message", (req, res) => {
  let { uid } = req.cookies;
  let { friendID } = req.body;
  conn.query(
    `select * from messages where senderID in (${uid},${friendID}) and receiverID in (${uid},${friendID}) order by time desc limit 25`,
    (err, data) => {
      if (err) {
        res.send("err");
        return;
      }
      res.render("message", { data, uid });
    }
  );
});

server.listen(8000);
