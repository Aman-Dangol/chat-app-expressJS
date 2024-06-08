import * as ajax from "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import { globals } from "./globals.js";
let friendList = document.getElementById("friendList");
let chatHeader = document.getElementById("chat-box-header");
console.log(chatHeader);

export async function updateFriendList() {
  await $.ajax({
    url: "/getfriends",
    method: "Get",
    success: (data) => {
      friendList.innerHTML = data;
    },
  });
  let friends = document.querySelectorAll(".friend");
  friends.forEach((friend) => {
    console.log(friend);
    friend.onclick = () => {
      chatHeader.innerText = friend.innerText;
      globals.receiverID = friend.id;
    };
  });
}

updateFriendList();
