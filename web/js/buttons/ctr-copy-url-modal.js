"use strict";

angular.module("risevision.storage.buttons.files")
.controller("CopyUrlCtrl", ["$scope", "$modalInstance", "params", function($scope, $modalInstance, params) {
  $scope.copyFile = params.copyFile;

  function encodeURIKeepForwardSlash(uri) {
  	return encodeURIComponent(uri).split("%2F").join("/");
  }

  setTimeout(function() {
    var copyUrl = params.copyFile.kind === "folder" ? 
                    params.folderSelfLinkUrl + encodeURIKeepForwardSlash(params.copyFile.name) : 
                    params.STORAGE_FILE_URL + params.bucketName + "/" + encodeURIKeepForwardSlash(params.copyFile.name);

    $("#copyUrlInput").val(copyUrl);
    $("#copyUrlInput").focus(function() { $(this).select(); } );
    $("#copyUrlInput").focus();
  },0);

  $scope.ok = function() {
    $modalInstance.close();
  };
  $scope.cancel = function() {
    $modalInstance.dismiss("cancel");
  };
}])
;
