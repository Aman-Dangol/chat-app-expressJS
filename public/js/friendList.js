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
      // leaving preivious room
      roomLeave(globals.receiverID);
      chatBox.innerHTML = " ";
      chatHeader.innerText = friend.innerText;
      globals.receiverID = friend.id;
      let x = await loadMessages(friend.id);
      chatBox.style.visibility = "hidden";
      chatBox.innerHTML = x;
      setTimeout(() => {
        chatBox.scroll(0, chatBox.scrollHeight);
        chatBox.style.visibility = "visible";
      }, 40);
      console.log(chatBox.scrollHeight);
      roomJoin(friend.id);
    };

    globals.receiverID = friends[0].id;
    friends[0].click();
  });
}

updateFriendList();
