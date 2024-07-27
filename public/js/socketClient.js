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
  console.log(textfield.type);
  if (textfield.type == "file") {
    socket.emit("send-message", {
      message: textfield.files[0],
      name: textfield.files[0].name,
      msgType: "file",
      friendID: globals.receiverID,
    });
  } else {
    socket.emit("send-message", {
      message: textfield.value,
      msgType: "text",
      friendID: globals.receiverID,
    });
  }
  if (textfield.type == "text") {
    createMessageBox(textfield.value, cookieObj.uid, "right");
  }

  textfield.value = "";
  textfield.type = "text";
});

// receive message

socket.on("receive-message", (m) => {
  createMessageBox(m.msg, m.id, "left");
  reload();
});

// create messagebox and displaying the message in the chat-box
function createMessageBox(content, id, direction) {
  // console.log(content, id, direction);

  let messageDiv = document.createElement("div");
  let contentDiv = document.createElement("div");
  let userDiv = document.createElement("div");
  userDiv.innerText = id;
  contentDiv.innerText = content;

  messageDiv.appendChild(userDiv);
  messageDiv.appendChild(contentDiv);

  messageDiv.className = direction + " messageBox";

  chatBox.appendChild(messageDiv);
  chatBox.scroll(0, chatBox.scrollHeight);
  console.log("hree", chatBox.scrollHeight);
}

function cookieparse() {
  console.log(document.cookie);
  let cookies = document.cookie.split("; ");
  cookies.forEach((cookie) => {
    let keyValue = cookie.split("=");
    console.log(keyValue);
    cookieObj[keyValue[0]] = keyValue[1];
    console.log(cookieObj);
  });
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

socket.on("notification", () => {
  console.log("notification");
  updateFriendList();
});
export function roomJoin(friendID) {
  socket.emit("join-room", friendID);
}

export function roomLeave(friendID) {
  socket.emit("leave-room", friendID);
}

socket.on("reload", reload);

function reload() {
  document.getElementById(globals.receiverID).click();
}
