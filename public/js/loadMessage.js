import * as globals from "./globals.js";
export const loadMessages = (fID) => {
  $.ajax({
    url: "/message",
    method: "POST",
    data: { friendID: fID },
    success: (data) => {
      console.log("cookir", data);
    },
    error: () => {
      console.log(error);
    },
  });
};
