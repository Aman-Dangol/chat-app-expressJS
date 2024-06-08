const express = require("express");
function auth(
  req = express.request,
  res = express.response,
  next = express.next
) {
  if (!req.cookies.uid) {
    console.log("not logged in");
    res.render("login");
    return;
  }
}

module.exports.auth = auth;
