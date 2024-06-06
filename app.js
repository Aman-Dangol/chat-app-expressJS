const express = require("express");
const socket = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = new socket.Server(server);

app.set("view engine", "ejs");

io.on("connection", (socket) => {
  console.log(socket.id);
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(8000);
