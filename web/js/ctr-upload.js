"use strict";

angular.module("medialibrary").controller("UploadController", ["$scope", "$route", "$routeParams", "$http", "FileUploader", "UploadURIService", "FileListService",
function ($scope, $route, $routeParams, $http, FileUploader, uriSvc, filesSvc) {
  var uploader = $scope.uploader = new FileUploader();

  uploader.method = "PUT";

  uploader.onAfterAddingFile = function(fileItem) {
    console.info("onAfterAddingFile", fileItem);
    $scope.uploadActive = true;
    if ($routeParams.folder) {
      fileItem.file.name = $routeParams.folder + "/" + fileItem.file.name;
    }

    $scope.uploadStatusMessage = "Requesting permission";

    uriSvc.getURI($routeParams.companyId, encodeURIComponent(fileItem.file.name))
    .then(function(resp) {
      fileItem.url = resp;
      uploader.uploadItem(fileItem);
    });
  };

  uploader.onBeforeUploadItem = function(item) {
    $scope.uploadStatusMessage = "Uploading " + item.file.name;
  };

  uploader.onCancelItem = function(item) {
    uploader.removeFromQueue(item);
    if (uploader.queue.length === 0) {$scope.uploadActive = false;}
  };

  uploader.onCompleteItem = function(item) {
    if (item.isCancel) {return;}
    $scope.uploadStatusMessage = "Verifying " + item.file.name;

    function verifySize(size) {
      return parseInt(size) === item.file.size;
    }

    $http({method: "GET",
           url: "https://www.googleapis.com/storage/v1/b/risemedialibrary-" +
                $routeParams.companyId + "/o/" + encodeURIComponent(item.file.name)})
    .then(function(resp) {
      if (!resp.data || !verifySize(resp.data.size)) {
        $scope.uploadStatusMessage = "Upload did not complete";
        item.isError = true;
        return;
      }
      resp.data.updated = {value: Date.parse(resp.data.updated).toString()};
      filesSvc.addFile(resp.data);
      item.isSuccess = true;
      uploader.removeFromQueue(item);
      if (uploader.queue.length === 0) {$scope.uploadActive = false;}
    }, function(err) {
      console.log(err);
      $scope.uploadStatusMessage = "Could not verify";
    });
  };
}]);

