const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { socket } = require("./socket.js");
app.set("view engine", "ejs");

app.use("/public", express.static("./public"));
// initializing socket
socket(server);
app.get("/", (req, res) => {
  res.render("index");
});

server.listen(8000);
