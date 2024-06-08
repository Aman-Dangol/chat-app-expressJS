import { io } from "/public/js/socketConnect.js";
const socket = io();

// getting a form
let form = document.getElementById("form");
let textfield = document.getElementById("textField");

// gettting chat-box
let chatBox = document.getElementById("chat-box");

// working on form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!textfield.value) {
    console.log("empty text");
    return;
  }
  socket.emit("send-message", textfield.value);
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
