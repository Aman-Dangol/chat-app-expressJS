const { Server } = require("socket.io");

// socket to work
function intializeSocket(server) {
  console.log("initializig");
  const io = new Server(server);
  io.on("connection", (socket) => {
    // sending a message
    socket.on("send-message", (message) => {
      socket.broadcast.emit("receive-message", message);
    });
    // changing socketid

    socket.on("provideID", (id) => {
      socket.id = id;
      console.log(socket.id);
    });
  });
}

module.exports.socket = intializeSocket;
