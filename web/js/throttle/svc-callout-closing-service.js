"use strict";

angular.module("risevision.storage.throttle", [])
.factory("calloutClosingService",function() {
  var svc = {files:[]};
  svc.add = function(file) {
    if (svc.files.length === 0) {svc.files.push({"file":{"name":"/"}});}
    if (svc.files[0].file.name !== file.name) {svc.files.push({"file": file});}
  };

  svc.closeCallout = function() {
    var fileObj = svc.files.shift();
    if (fileObj && fileObj.hasOwnProperty("file")) {
        fileObj.file.showThrottledCallout = false;
    }
  };
  return svc;
});
