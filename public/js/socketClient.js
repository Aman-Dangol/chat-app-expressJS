import { io } from "./socketConnect.js";
import { updateFriendList } from "./friendList.js";
import { globals } from "./globals.js";
const cookieObj = {};
let socket;
// getting a form
let form = document.getElementById("form");
let textfield = document.getElementById("textField");
let connectForm = document.getElementById("friendConnect");

// intializing socket
function socketInit() {
  socket = io();
  cookieparse();
  console.log(cookieObj);
  socket.emit("provideID", cookieObj.uid);
}
socketInit();
// gettting chat-box
let chatBox = document.getElementById("chat-box-body");

// working on form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!textfield.value) {
    return;
  }
  socket.emit("send-message", {
    message: textfield.value,
    friendID: globals.receiverID,
  });
  createMessageBox(textfield.value, cookieObj.uid, "right");
  textfield.value = "";
});

// receive message

socket.on("receive-message", (m) => {
  createMessageBox(m.msg, m.id, "left");
});

// create messagebox and displaying the message in the chat-box
function createMessageBox(content, id, direction) {
  // console.log(content, id, direction);
  let messageDiv = document.createElement("div");
  messageDiv.className = direction;
  messageDiv.innerText = id + " " + content;
  chatBox.appendChild(messageDiv);
  chatBox.scroll(0, chatBox.scrollHeight);
}

function cookieparse() {
  let keyValue = document.cookie.split("=");
  cookieObj[keyValue[0]] = keyValue[1];
}

// connect with friend

connectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let friendID = document.getElementById("friendID");
  socket.emit("addFriend", {
    userID: cookieObj.uid,
    friendID: friendID.value,
  });
  updateFriendList();
});

export function roomJoin(friendID) {
  socket.emit("join-room", friendID);
}

export function roomLeave(friendID) {
  socket.emit("leave-room", friendID);
}
