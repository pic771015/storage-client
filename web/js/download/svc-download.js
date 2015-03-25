"use strict";
angular.module("risevision.storage.download",[])
.factory("DownloadService", ["$timeout", "$window", "GAPIRequestService", "$stateParams",
function($timeout, $window, requestor, $stateParams) {
  var svc = {};
  var downloadCount = 0;
  var iframeContainer = document.createElement("div");

  iframeContainer.style.display = "none";
  document.body.appendChild(iframeContainer);

  svc.rejectedUploads = [];

  svc.downloadURL = function(url) {
    var hiddenIFrameID = "hiddenDownloader" + downloadCount++;
    var iframe = document.createElement("iframe");
    iframe.id = hiddenIFrameID;
    iframe.style.display = "none";
    iframeContainer.appendChild(iframe);
    iframe.src = url;
  };

  svc.downloadFiles = function(files, bucketName, delay) {
    $timeout(function() {
      if (files.length === 0) {
        $timeout(function() {
          $(iframeContainer).empty();
        }, 1000);
        
        return;
      }

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

            svc.downloadURL(resp.message + "&response-content-disposition=attachment;filename=" + encodeURIComponent(downloadName));
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
