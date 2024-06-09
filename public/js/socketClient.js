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
}
socketInit();
// gettting chat-box
let chatBox = document.getElementById("chat-box");

// working on form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!textfield.value) {
    console.log("empty text");
    return;
  }
  socket.emit("send-message", {
    message: textfield.value,
    friendID: globals.receiverID,
  });
  console.log(globals);
  createMessageBox(textfield.value, "right");
  textfield.value = "";
});

// receive message

socket.on("receive-message", (m) => {
  console.log(m);
  createMessageBox(m, "left");
});

// create messagebox and displaying the message in the chat-box
function createMessageBox(content, direction) {
  let messageDiv = document.createElement("div");
  messageDiv.className = direction;
  messageDiv.innerText = content;
  chatBox.appendChild(messageDiv);
}

function cookieparse() {
  let keyValue = document.cookie.split("=");
  cookieObj[keyValue[0]] = keyValue[1];
  console.log(cookieObj);
  socket.emit("provideID", cookieObj.uid);
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
