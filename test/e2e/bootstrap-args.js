/*global process */
"use strict";

var LOCAL, USER, PASSWORD;

LOCAL = process.argv.some(function(el) {return el === "--local";});

USER = process.argv.filter(function(el) {
  return el.indexOf("--user") === 0;
})[0];

PASSWORD = process.argv.filter(function(el) {
  return el.indexOf("--password") === 0;
})[0];

if (PASSWORD === undefined) {
  console.log("--password not specified");
  process.exit(1);
}

if (USER === undefined) {
  console.log("--user not specified");
  process.exit(1);
}

PASSWORD = PASSWORD.split("=")[1];
USER = USER.split("=")[1];

exports.PASSWORD = PASSWORD;
exports.USER = USER;
