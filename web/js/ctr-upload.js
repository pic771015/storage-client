"use strict";

angular.module("medialibrary").controller("UploadController", ["$scope", "$stateParams", "$http", "FileUploader", "UploadURIService", "FileListService",
function ($scope, $stateParams, $http, FileUploader, uriSvc, filesSvc) {
  var uploader = $scope.uploader = new FileUploader();

  uploader.method = "PUT";
  $scope.status = {};

  uploader.onAfterAddingFile = function(fileItem) {
    console.info("onAfterAddingFile", fileItem);
    fileItem.file.name = decodeURIComponent($stateParams.folderPath || "") +
                         fileItem.file.name;

    $scope.status.message = "Requesting permission";

    uriSvc.getURI(fileItem.file)
    .then(function(resp) {
      fileItem.url = resp;
      uploader.uploadItem(fileItem);
    })
    .then(null, function(resp) {
      $scope.status = resp;
    });
  };

  uploader.onBeforeUploadItem = function(item) {
    $scope.status.message = "Uploading " + item.file.name;
  };

  uploader.onCancelItem = function(item) {
    uploader.removeFromQueue(item);
  };

  uploader.onCompleteItem = function(item) {
    if (item.isCancel) {return;}
    $scope.status.message = "Verifying " + item.file.name;

    function verifySize(size) {
      return parseInt(size) === item.file.size;
    }

    $http({method: "GET",
           url: "https://www.googleapis.com/storage/v1/b/risemedialibrary-" +
                $stateParams.companyId + "/o/" + encodeURIComponent(item.file.name)})
    .then(function(resp) {
      if (!resp.data || !verifySize(resp.data.size)) {
        $scope.status.message = "Upload did not complete";
        item.isError = true;
        return;
      }
      resp.data.updated = {value: Date.parse(resp.data.updated).toString()};
      filesSvc.addFile(resp.data);
      item.isSuccess = true;
      uploader.removeFromQueue(item);
    }, function(err) {
      console.log(err);
      $scope.status.message = "Could not verify";
    });
  };
}]);

