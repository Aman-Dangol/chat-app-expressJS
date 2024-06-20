import * as ajax from "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
import { roomJoin, roomLeave } from "./socketClient.js";
import { globals } from "./globals.js";
let friendList = document.getElementById("friendList");
let chatHeader = document.getElementById("chat-box-header");
let chatBox = document.getElementById("chat-box-body");

export async function updateFriendList() {
  await $.ajax({
    url: "/getfriends",
    method: "Get",
    success: (data) => {
      friendList.innerHTML = data;
    },
  });
  let friends = document.querySelectorAll(".friend");
  friends.forEach((friend, index) => {
    if (index == 0) {
      globals.receiverID = friend.id;
      console.log("first contact of friend", friend.id);
    }
    friend.onclick = () => {
      if (chatHeader.innerText == friend.innerText) {
        return;
      }
      // leaving preivious room
      roomLeave(globals.receiverID);
      chatBox.innerHTML = " ";
      chatHeader.innerText = friend.innerText;
      globals.receiverID = friend.id;
      console.log(globals.receiverID);
      roomJoin(friend.id);
    };
  });
}

updateFriendList();
