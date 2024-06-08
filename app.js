const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// working on socket module
const { socket } = require("./socket.js");
// initializing socket
socket(server);

app.set("view engine", "ejs");

app.use("/public", express.static("./public"));

app.get("/", (req, res) => {
  res.render("index");
});

// registerPage
app.get("/register", (req, res) => {
  res.render("register");
});

server.listen(8000);
