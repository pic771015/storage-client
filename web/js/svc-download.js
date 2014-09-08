"use strict";
angular.module("medialibrary")
.factory("DownloadService", ["$timeout", "$window", function($timeout, $window) {
  var svc = {};
  svc.downloadFiles = function(files, bucketName, delay) {
    $timeout(function() {
      if (files.length === 0) {return;}
      var fileName = files.shift().name;
      if (fileName.substr(-1) !== "/") {
        $window.location.assign("https://www.googleapis.com/storage/v1/b/" +
            bucketName + "/o/" +
            encodeURIComponent(fileName) + "?alt=media");
      }
      svc.downloadFiles(files, bucketName, 1000);
    }, delay, false);
  };
  return svc;
}]);
