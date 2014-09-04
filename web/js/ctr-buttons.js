"use strict";
/* global gadgets: true */

angular.module("medialibrary")
.controller("ModalWindowController", ["$scope", function($scope) {
  $scope.closeButtonClick = function() {
    gadgets.rpc.call("", "rscmd_closeSettings", null);
  };
}])

.controller("ButtonsController",
["$scope", "$routeParams", "$window", "FileListService",
"GAPIRequestService", "MEDIA_LIBRARY_URL",
function ($scope, $routeParams, $window, listSvc, requestSvc,
MEDIA_LIBRARY_URL) {
  $scope.storageModal = ($window.location.href.indexOf("storage-modal.html") > -1);
  var bucketName = "risemedialibrary-" + $routeParams.companyId;
  var bucketUrl = MEDIA_LIBRARY_URL + bucketName + "/";

  $scope.filesDetails = listSvc.filesDetails;
  $scope.inFolder = $routeParams.folder ? true : false;

  $scope.cancelButtonClick = function() {
    console.log("Cancel selected: Posting close message");
    $window.parent.postMessage("close", "*");
  };

  $scope.uploadButtonClick = function() {
    $("#file").click();
  };

  $scope.downloadButtonClick = function(event, file) {
    if (!file) {
      file = getSelectedFiles()[0];
    }
    if (file) {
      $window.location.assign("https://www.googleapis.com/storage/v1/b/" +
          bucketName + "/o/" +
          file.name + "?alt=media");
    }
  };

  $scope.deleteButtonClick = function() {
    var selectedFileNames = getSelectedFiles().map(function(file) {
      return file.name;
    });
    var confirmationMessage = "Please confirm PERMANENT deletion of:\n\n";

    selectedFileNames.forEach(function(val) {
      if (val.substr(-1) === "/") {
        confirmationMessage += "folder: " + val + " and all its contents" + "\n";
      } else {
        confirmationMessage += "file: " + val + "\n";
      }
    });

    if (confirm(confirmationMessage)) {
      var requestParams = {"companyId": $routeParams.companyId
                          ,"files": selectedFileNames};
      requestSvc.executeRequest("storage.files.delete", requestParams)
      .then(function() {
        listSvc.resetSelections();
        listSvc.refreshFilesList($routeParams.companyId, $routeParams.folder);
      });
    }
  };

  $scope.selectButtonClick = function() {
    var fileUrls = [], data = {};
    data.params = [];

    getSelectedFiles().forEach(function(file) {
      fileUrls.push(bucketUrl + file.name);
      data.params.push(bucketUrl + file.name);
    });

    $window.parent.postMessage(fileUrls, "*");
    gadgets.rpc.call("", "rscmd_saveSettings", null, data);
  };

  $scope.newFolderButtonClick = function() {
    var requestParams, folderName = prompt("Enter a folder name");
    if (!folderName || folderName.indexOf("/") > -1) {return;}
    requestParams = {"companyId":$routeParams.companyId
                    ,"folder": folderName};

    requestSvc.executeRequest("storage.createFolder", requestParams)
    .then(function() {listSvc.refreshFilesList($routeParams.companyId);});
  };

  function getSelectedFiles() {
    var selectedFiles = [];

    for ( var i = 0; i < $scope.filesDetails.files.length; ++i ) {
      if ($scope.filesDetails.files[ i ].isChecked) {
        selectedFiles.push($scope.filesDetails.files[i]);
      }
    }
    return selectedFiles;
  }
}]);
