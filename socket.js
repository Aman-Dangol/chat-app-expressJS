const socket = require("socket.io");
const http = require('http')
function intializeSocket(server) {
  const io = socket(server);
  io.on('connection',(socket)=>{
    console.log(socket.id);
  })
}

module.exports.socket = intializeSocket;
