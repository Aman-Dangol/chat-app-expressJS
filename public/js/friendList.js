import { roomJoin, roomLeave } from "./socketClient.js";
import { globals } from "./globals.js";
import { loadMessages } from "./loadMessage.js";
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
    friend.onclick = async () => {
      if (chatHeader.innerText == friend.innerText) {
        return;
      }
      // leaving preivious room
      roomLeave(globals.receiverID);
      chatBox.innerHTML = " ";
      chatHeader.innerText = friend.innerText;
      globals.receiverID = friend.id;
      let x = await loadMessages(friend.id);
      chatBox.innerHTML = x;
      chatBox.scroll(0, chatBox.scrollHeight);
      console.log(globals.receiverID);
      roomJoin(friend.id);
    };
    if (index == 0) {
      globals.receiverID = friend.id;
      friend.click();
      console.log("first contact of friend", friend.id);
    }
  });
}

updateFriendList();
