const { Server } = require("socket.io");
const { conn } = require("./db.js");



// socket to work
function intializeSocket(server) {
  const io = new Server(server);
  io.on("connection", (socket) => {
    // sending a message
    socket.on("send-message", (message) => {
      console.log(socket);
      socket.broadcast.emit("receive-message", message);
    });
    // changing socketid
    socket.on("provideID", (id) => {
      socket.customID = id;
    });

    // connecting to a friend/user
    socket.on("addFriend", (obj) => {
      const { userID, friendID } = obj;
      // checking if friend exist
      conn.query(
        `select * from users where users.id =${friendID}`,
        (err, data) => {
          if (err) {
            console.log("err");
            return;
          }
          if (data.length == 0) {
            console.log("this user doesn't exist");
            return;
          }
          console.log("user exists");
          // adding user to friend
          conn.query(
            `insert into friends(userID,friendID) values(${userID},${friendID})`
          );
          // adding friend to user
          conn.query(
            `insert into friends(userID,friendID) values(${friendID},${userID})`
          );
          console.log("friend added");
        }
      );

      // adding friend
    });
  });
}

module.exports.socket = intializeSocket;
