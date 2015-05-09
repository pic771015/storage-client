/* globals zip */
"use strict";
angular.module("risevision.storage.download",[])
.factory("DownloadService", ["$timeout", "$window", "GAPIRequestService", "$stateParams",
function($timeout, $window, requestor, $stateParams) {
  var svc = {};
  var downloadCount = 0;
  var iframeContainer = document.createElement("div");

  iframeContainer.style.display = "none";
  document.body.appendChild(iframeContainer);

  console.log("Initializing zip.js");
  zip.useWebWorkers = true;
  zip.workerScriptsPath = "/lib/zip.js/";

  svc.rejectedUploads = [];

  svc.downloadURL = function(url, fileName) {
    var hiddenIFrameID = "hiddenDownloader" + downloadCount++;
    var iframe = document.createElement("iframe");
    iframe.id = hiddenIFrameID;
    iframe.style.display = "none";
    iframeContainer.appendChild(iframe);
    iframe.src = url + "&response-content-disposition=attachment;filename=" + fileName;
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
        svc.downloadFile(file);
      }
      else {
        console.log("downloadFolder");
        svc.downloadFolder(file);
      }

      svc.downloadFiles(files, bucketName, 1000);
    }, delay, false);
  };

  svc.downloadFile = function(file) {
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

        svc.downloadURL(resp.message, encodeURIComponent(downloadName));
      }
      else {
        console.log(resp.message);
        file.rejectedUploadMessage = resp.message;
        svc.rejectedUploads.push(file);
      }
    });
  };

  svc.downloadFolder = function(folder) {
    var params = {
      companyId: $stateParams.companyId,
      folderName: folder.name
    };

    requestor.executeRequest("storage.getFolderContents", params).then(function (resp) {
      console.log("storage.getFolderContents", resp);

      zip.createWriter(new zip.BlobWriter("application/zip"), function(writer) {
        var idx = 0;

        (function addFile() {
          var file = resp.items[idx];

          console.log("addFile", file);

          writer.add(file.objectId, !file.folder ? new zip.HttpReader(file.signedURL) : null, function() {
            idx++;

            if(idx < resp.items.length) {
              addFile();
            }
            else {
              console.log("closing zip");

              writer.close(function(blob) {
                var URL = window.webkitRequestFileSystem.webkitURL;

                console.log("URL", URL);

                svc.downloadURL(URL.createObjectURL(blob), encodeURIComponent(folder.name) + ".zip");
              });
            }
          });
        })();
      }, function(err) {
        console.log(err);
      });

      console.log(resp);
    });
  };

  return svc;
}]);
