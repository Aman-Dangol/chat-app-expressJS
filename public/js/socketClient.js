import { io } from "/public/js/socketConnect.js";
const socket = io();

// getting a form
let form = document.getElementById("form");
let textfield = document.getElementById("textField");
console.log(textfield);

// working on form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!textfield.value) {
    console.log("empty text");
    return;
  }
  socket.emit("send-message", textfield.value);
});
