const { Server } = require("socket.io");

// socket to work
function intializeSocket(server) {
  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log(socket.id);
    // sending a message
    socket.on("send-message", (message) => {
      socket.broadcast.emit("receive-message", message);
    });
  });
}

module.exports.socket = intializeSocket;
