/* global gapi: true, uploadFinished, window, XMLHttpRequest */
"use strict";

module.exports = function(casper) {
  casper.then(function() {
    this.evaluate(function(companyId) {
      var uploadFinished = false;

      function storageApiCall(commandString, paramObj, callback) {
        var commandArray = commandString.split(".");
        var commandObject = gapi.client.storage;

        commandArray.forEach(function(val) {
          commandObject = commandObject[val];
        });
       
        commandObject(paramObj).execute(function(resp) {
          callback(resp);
        });
      }

      function getUploadToken(fileName, cb) {
        storageApiCall("getResumableUploadURI", {
          "companyId": companyId,
          "fileName": fileName,
          "fileType": "",
          "origin": window.location.origin
        }, cb, true);
      }

      function createFile(fileName) {
        getUploadToken(encodeURIComponent(fileName), uploadFile);

        function uploadFile(tokenResponse) {
          var xhr = new XMLHttpRequest();
          xhr.open("PUT", tokenResponse.message, true);
          xhr.onload = function() { uploadFinished = true; };
          xhr.onerror = function(e) { uploadFinished = true; console.log("Upload failed " + e); };
          xhr.send("test data");
        }
      }

      createFile("test.txt");
    }, casper.cli.options.companyId);

    casper.echo("Upload started.");

    // Wait for upload to finish
    casper.waitFor(function() {
      return casper.evaluate(function() {
        return uploadFinished;
      });
    }, function() {casper.echo("Upload finished.");});
  });
};
