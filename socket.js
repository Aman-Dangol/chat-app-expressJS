const { Server } = require("socket.io");
const { conn } = require("./db.js");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
// socket to work
function intializeSocket(server) {
  const io = new Server(server, {
    maxHttpBufferSize: 1e8,
  });
  io.on("connection", (socket) => {
    // sending a message
    console.log("connecton");
    socket.on("send-message", (msgDetails) => {
      let fname = msgDetails.message;
      let path = "";
      if (msgDetails.msgType == "file") {
        path = "/public/uploads/";
        fname = fileCheck("./public/uploads/", msgDetails.name);
        fs.writeFile(`./public/uploads/${fname}`, msgDetails.message, (err) => {
          if (err) {
            console.log("error when writing the file in the directory");
            return;
          }
        });
        io.to(socket.id).emit("reload");
      }
      if (!msgDetails.friendID) {
        socket.broadcast.emit("receive-message", msgDetails.name);
        return;
      }
      let room = getRoom(socket, msgDetails.friendID);
      conn.query(
        `insert into messages(senderID,receiverID,message,messageType) values(?,?,?,?)`,
        [
          socket.customID,
          msgDetails.friendID,
          path + fname,
          msgDetails.msgType,
        ],
        (err) => {
          if (err) {
            console.log(err);
            return;
          }
        }
      );
      socket.to(room).emit("receive-message", {
        msg: msgDetails.message,
        id: socket.customID,
      });
    });
    // changing socketid
    socket.on("provideID", (id) => {
      socket.customID = id;
      console.log(socket.customID);
    });

    // connecting to a friend/user
    socket.on("addFriend", (obj) => {
      const { userID, friendID } = obj;
      // checking if friend exist
      conn.query(
        `select * from users where users.id =${friendID}`,
        (err, data) => {
          if (err) {
            console.log("err when adding a friend");
            return;
          }
          if (data.length == 0) {
            console.log("this user doesn't exist");
            return;
          }
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
          io.sockets.sockets.forEach((socket) => {
            if (socket.customID == friendID) {
              socket.emit("notification");
            }
          });
        }
      );

      // adding friend
    });
    socket.on("join-room", (id) => {
      let room = "";
      room = getRoom(socket, id);
      socket.join(room);
    });

    socket.on("leave-room", (id) => {
      if (!id) {
        return;
      }
      socket.leave(getRoom(socket, id));
    });
  });
}

function getRoom(socket, friendID) {
  if (parseInt(socket.customID) < friendID) {
    return "" + socket.customID + friendID;
  }
  return "" + friendID + socket.customID;
}

const fileCheck = (dir, filename, counter = 0) => {
  let parsedfile = path.parse(filename);
  let { name, ext } = parsedfile;
  counter = parseInt(counter);

  // if counter is 0 dont concatenate 0 else concatenate the number
  let newFileName = name + (counter == 0 ? "" : counter) + ext;
  if (fs.existsSync(`${dir}/${newFileName}`)) {
    return fileCheck(dir, filename, ++counter);
  }
  return newFileName;
};

module.exports.socket = intializeSocket;
