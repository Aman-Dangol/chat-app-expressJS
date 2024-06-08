import * as ajax from "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";

let friendList = document.getElementById("friendList");
console.log(friendList);

export function updateFriendList() {
  $.ajax({
    url: "/getfriends",
    method: "Get",
    success: (data) => {
      friendList.innerHTML = data;
      console.log(data);
    },
  });
}

updateFriendList();
