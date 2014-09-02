"use strict";

angular.module("medialibrary").controller("UploadController", ["$scope", "$route", "$routeParams", "$http", "FileUploader", "UploadURIService", "FileListService",
function ($scope, $route, $routeParams, $http, FileUploader, uriSvc, filesSvc) {
  var uploader = $scope.uploader = new FileUploader();
  $scope.uploadComplete = false;
  $scope.uploadError = false;
  $scope.uploadActive = false;

  uploader.method = "PUT";
  uploader.removeAfterUpload = true;

  uploader.onAfterAddingFile = function(fileItem) {
    console.info("onAfterAddingFile", fileItem);
    $scope.uploadActive = true;
    if ($routeParams.folder) {
      fileItem.file.name = $routeParams.folder + "/" + fileItem.file.name;
    }

    $scope.statusMessage = "Requesting permission";

    uriSvc.getURI($routeParams.companyId, encodeURIComponent(fileItem.file.name))
    .then(function(resp) {
      $scope.statusMessage = "Uploading data";
      fileItem.url = resp;
      fileItem.upload();
    });
  };

  uploader.onCompleteItem = function(item) {
    $scope.statusMessage = "Verifying";

    function verifySize(size) {
      return parseInt(size) === item.file.size;
    }

    $http({method: "GET",
           url: "https://www.googleapis.com/storage/v1/b/risemedialibrary-" +
                $routeParams.companyId + "/o/" + encodeURIComponent(item.file.name)})
    .then(function(resp) {
      if (!resp.data || !verifySize(resp.data.size)) {
        $scope.statusMessage = "Upload did not complete";
        return;
      }
      $scope.statusMessage = "Upload complete";
      $scope.uploadActive = false;
      filesSvc.addFile(resp.data);
    }, function(err) {
      console.log(err);
      $scope.statusMessage = "Could not verify";
    });
  };
}]);

