/* global process, __dirname */

"use strict";

var path = require("path");
var http = require("http");
var express = require("express");
var serveStatic = require("serve-static");
var app = express();
var server = http.createServer(app);
var port = process.env.port;
var root = process.env.root;

app.use(serveStatic(path.join(__dirname)));
app.use(serveStatic(path.join(__dirname, root)));

// Just send the index.html for other files to support HTML5Mode
app.all("*", function(req, res) {
  res.sendFile(path.join(__dirname, root, "index.html"));
});

server.listen(port, function() {
  console.log("Server listening at http://localhost:" + port);
});
