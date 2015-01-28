"use strict";

angular.module("medialibrary").controller("UploadController",
["$scope", "$rootScope", "$stateParams", "$http", "FileUploader", "UploadURIService", "FileListService", "$translate", "STORAGE_UPLOAD_CHUNK_SIZE",
function ($scope, $rootScope, $stateParams, $http, uploader, uriSvc, filesSvc, $translate, chunkSize) {
  $scope.uploader = uploader;
  $scope.status = {};

  $scope.removeItem = function(item) {
    $scope.uploader.removeFromQueue(item);
  };

  uploader.onAfterAddingFile = function(fileItem) {
    console.info("onAfterAddingFile", fileItem);
    fileItem.file.name = decodeURIComponent($stateParams.folderPath || "") +
                         fileItem.file.name;

    $translate("storage-client.requesting-permission").then(function(msg) {
      $scope.status.message = msg;
    });
    
    uriSvc.getURI(fileItem.file)
    .then(function(resp) {
      $rootScope.$emit("refreshSubscriptionStatus", "trial-available");

      fileItem.url = resp;
      fileItem.chunkSize = chunkSize;
      uploader.uploadItem(fileItem);
    })
    .then(null, function(resp) {
      $scope.status.message = resp;
    });
  };

  uploader.onBeforeUploadItem = function(item) {
    $translate("storage-client.uploading", { filename: item.file.name }).then(function(msg) {
      $scope.status.message = msg;
    });
  };

  uploader.onCancelItem = function(item) {
    uploader.removeFromQueue(item);
  };

  uploader.onCompleteItem = function(item) {
    if (item.isCancel) {return;}

    if (!item.isSuccess){
      $translate("storage-client.upload-failed").then(function(msg) {
        $scope.status.message = msg;
      });
      return;
    }

    filesSvc.addFile(
      {"name": item.file.name
      ,"updated": {"value": new Date().valueOf().toString()}
      ,"size": item.file.size
      ,"type": item.file.type}
    );

    uploader.removeFromQueue(item);
  };
}])

.directive("storageFileSelect", [function() {
  return {
    link: function(scope, element, attributes) {
      var uploader = scope.$eval(attributes.uploader);

      element.bind("change", function() {
        uploader.addToQueue(this.files);

        element.prop("value", null);
      });
    }
  };
}])
;
