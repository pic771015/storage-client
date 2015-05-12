"use strict";

angular.module("risevision.storage.upload")
.controller("UploadController",
["$scope", "$rootScope", "$stateParams", "FileUploader", "UploadURIService", "FileListService", 
 "$translate", "STORAGE_UPLOAD_CHUNK_SIZE",
function ($scope, $rootScope, $stateParams, uploader, uriSvc, filesSvc, $translate, chunkSize) {
  $scope.uploader = uploader;
  $scope.status = {};

  $scope.removeItem = function(item) {
    uploader.cancelItem(item);
  };

  $scope.activeUploadCount = function() {
    return uploader.queue.filter(function(file) {
      return file.isUploading;
    }).length;
  };

  uploader.onAfterAddingFile = function(fileItem) {
    console.info("onAfterAddingFile", fileItem.file.name);
    fileItem.file.name = decodeURIComponent($stateParams.folderPath || "") +
                         fileItem.file.name;

    $translate("storage-client.uploading", { filename: fileItem.file.name }).then(function(msg) {
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

    var file = {
      "name": item.file.name,
      "updated": {"value": new Date().valueOf().toString()},
      "size": item.file.size,
      "type": item.file.type
    };

    filesSvc.addFile(file);

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
