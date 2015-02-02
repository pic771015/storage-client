"use strict";
angular.module("multi-download",[])
.factory("DownloadService", ["$timeout", "$window", "GAPIRequestService", "$stateParams",
  function($timeout, $window, requestor, $stateParams) {
  var svc = {};

  svc.rejectedUploads = [];

  svc.downloadFiles = function(files, bucketName, delay) {
    $timeout(function() {
      if (files.length === 0) {return;}
      var file = files.shift();
      var fileName = file.name;
      if (fileName.substr(-1) !== "/") {
        var params = {
          companyId: $stateParams.companyId,
          fileName: encodeURIComponent(file.name),
          fileType: file.type
        };
        requestor.executeRequest("storage.getSignedDownloadURI", params).then(function (resp) {
          if(resp.result) {
            var downloadName = file.name.replace("--TRASH--/", "");

            if(downloadName.indexOf("/") >= 0) {
              downloadName = downloadName.substr(downloadName.lastIndexOf("/") + 1);
            }

            $window.location.assign(resp.message + "&response-content-disposition=attachment;filename=" + encodeURIComponent(downloadName));
          }
          else {
            console.log(resp.message);
            file.rejectedUploadMessage = resp.message;
            svc.rejectedUploads.push(file);
          }
        });
      }
      svc.downloadFiles(files, bucketName, 1000);
    }, delay, false);
  };
  return svc;
}]);
