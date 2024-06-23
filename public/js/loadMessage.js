import * as globals from "./globals.js";
export const loadMessages = async (fID) => {
  let output = "err";
 await $.ajax({
    url: "/message",
    method: "POST",
    data: { friendID: fID },
    success: (data) => {
      console.log("data", data);
      output = data;
    },
    error: () => {
      console.log('error');
    },
  });
  return output;
};
