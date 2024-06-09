const { Server } = require("socket.io");
const { conn } = require("./db.js");

// socket to work
function intializeSocket(server) {
  const io = new Server(server);
  io.on("connection", (socket) => {
    // sending a message
    socket.on("send-message", (msgDetails) => {
      console.log(msgDetails);
      if (!msgDetails.friendID) {
        socket.broadcast.emit("receive-message", msgDetails.message);
        return;
      }
      let room = getRoom(socket, msgDetails.friendID);
      socket.to(room).emit("receive-message", msgDetails.message);
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
            `insert into friends(userID,friendID) values(${userID},${friendID})`,
            (err) => {
              if (err) {
                console.log("alrady a friend");
                return;
              }
              // adding friend to user
              conn.query(
                `insert into friends(userID,friendID) values(${friendID},${userID})`
              );
            }
          );
          console.log("friend added");
        }
      );

      // adding friend
    });
    socket.on("join-room", (id) => {
      let room = "";
      console.log("your id is " + socket.customID);
      console.log("room join request", id);
      room = getRoom(socket, id);
      socket.join(room);
      console.log("joining room" + room);
      console.log(socket.rooms);
    });
  });
}

function getRoom(socket, friendID) {
  if (parseInt(socket.customID) < friendID) {
    return "" + socket.customID + friendID;
  }
  return "" + friendID + socket.customID;
}

module.exports.socket = intializeSocket;
