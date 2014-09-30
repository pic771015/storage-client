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
    var listItem;
    if (item.isCancel) {return;}
    $scope.status.message = "Verifying " + item.file.name;

    function getListItem(data) {
      if (!data || !data.items) {return undefined;}

      for (var i = 0, j = data.items.length; i < j; i += 1) {
        if (data.items[i].name === item.file.name) {
          listItem = data.items[i];
          break;
        }
      }

      return listItem;
    }

    $http({method: "GET",
           url: "https://www.googleapis.com/storage/v1/b/risemedialibrary-" +
                $stateParams.companyId + "/o"})
    .then(function(resp) {
      listItem = getListItem(resp.data);
      if (!listItem || parseInt(listItem.size) !== item.file.size) {
        $scope.status.message = "Upload did not complete";
        item.isError = true;
        return;
      }

      listItem.updated = {value: Date.parse(listItem.updated).toString()};
      filesSvc.addFile(listItem);
      item.isSuccess = true;
      uploader.removeFromQueue(item);
    }, function(err) {
      console.log(err);
      $scope.status.message = "Could not verify";
    });
  };
}]);

