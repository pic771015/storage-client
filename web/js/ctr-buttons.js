"use strict";
/* global gadgets: true */

angular.module("medialibrary")
.controller("ModalWindowController", ["$scope", function($scope) {
  $scope.closeButtonClick = function() {
    gadgets.rpc.call("", "rscmd_closeSettings", null);
  };
}])
.controller("DeleteInstanceCtrl", ["$scope","$modalInstance", "confirmationMessages", function($scope, $modalInstance, confirmationMessages) {
    $scope.confirmationMessages = confirmationMessages;

    $scope.ok = function() {
        $modalInstance.close();
    };
    $scope.cancel = function() {
        $modalInstance.dismiss("cancel");
    };
}
])
.controller("NewFolderCtrl", ["$scope","$modalInstance", function($scope, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.close($scope.folderName);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss("cancel");
    };
}
])
.controller("ButtonsController",
["$scope", "$stateParams", "$window","$modal", "$log", "$timeout", "FileListService",
"GAPIRequestService", "MEDIA_LIBRARY_URL", "DownloadService", "$q", "$translate",
function ($scope, $stateParams, $window, $modal, $log, $timeout, listSvc, requestSvc,
MEDIA_LIBRARY_URL, downloadSvc, $q, $translate) {
  $scope.storageModal = ($window.location.href.indexOf("storage-modal.html") > -1);
  var bucketName = "risemedialibrary-" + $stateParams.companyId;
  var bucketUrl = MEDIA_LIBRARY_URL + bucketName + "/";

  $scope.filesDetails = listSvc.filesDetails;
  $scope.fileListStatus = listSvc.statusDetails;
  $scope.statusDetails = {code: 200, message: ""};

  $scope.showCloseButton = ($window.location.href.indexOf("storageFullscreen=true") === -1);

  $scope.resetStatus = function() {
    $scope.statusDetails.code = 200;
  };

  $("#deleteForm").submit(function(event){
    // prevent default browser behaviour
    event.preventDefault();
    $scope.deleteButtonClick();
  });

  $scope.cancelButtonClick = function() {
    console.log("Cancel selected: Posting close message");
    $window.parent.postMessage("close", "*");
  };

  $scope.uploadButtonClick = function() {
    $("#file").click();
  };

  $scope.downloadButtonClick = function() {
    listSvc.filesDetails.files.forEach(function(file) {
      if (file.name.substr(-1) === "/") {file.isChecked = false;}
    });
    downloadSvc.downloadFiles(getSelectedFiles(), bucketName, 100);
  };

  $scope.deleteButtonClick = function(size) {
      $scope.shouldBeOpen = true;
      var selectedFileNames = getSelectedFiles().map(function(file) {
          return file.name;
      });
      var msgPromises = [];

      selectedFileNames.forEach(function(val) {
          if (val.substr(-1) === "/") {
              msgPromises.push($translate("storage-client.delete-folder", { folder: val }));
          } else {
              msgPromises.push($translate("storage-client.delete-file", { file: val }));
          }
      });

      $q.all(msgPromises).then(function(confirmationMessages) {
        var modalInstance = $modal.open({
            templateUrl: "deleteModal.html",
            controller: "DeleteInstanceCtrl",
            size: size,
            resolve: {
                confirmationMessages: function(){
                    return confirmationMessages;
                }
            }
        });

        modalInstance.result.then(function() {
            //do what you need if user presses ok
            var requestParams = {"companyId": $stateParams.companyId
                ,"files": selectedFileNames};
            requestSvc.executeRequest("storage.files.delete", requestParams)
                .then(function(resp) {
                    if (resp.code === 403) {
                        $scope.statusDetails.code = resp.code;
                        $translate("storage-client.permission-refused", { email: resp.userEmail }).then(function(msg) {
                          $scope.statusDetails.message = msg;
                        });
                    }
                    listSvc.resetSelections();
                    listSvc.refreshFilesList();
                    $scope.shouldBeOpen = false;
                });
        }, function (){
            // do what you need to do if user cancels
            $log.info("Modal dismissed at: " + new Date());
            $scope.shouldBeOpen = false;
        });
      });
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

  $scope.newFolderButtonClick = function(size) {
      $scope.shouldBeOpen = true;

      var modalInstance = $modal.open({
          templateUrl: "newFolderModal.html",
          controller: "NewFolderCtrl",
          size: size
      });
      modalInstance.result.then(function(newFolderName){
          //do what you need if user presses ok
          if (!newFolderName || newFolderName.indexOf("/") > -1) {return;}
          var requestParams =
          {"companyId":$stateParams.companyId
              ,"folder": decodeURIComponent($stateParams.folderPath || "") +
              newFolderName};

          requestSvc.executeRequest("storage.createFolder", requestParams)
              .then(function() {listSvc.refreshFilesList();});
      }, function (){
          // do what you need to do if user cancels
          $log.info("Modal dismissed at: " + new Date());
      });
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
}])
.directive("focusMe", function($timeout) {
    return {
        scope: { trigger: "@focusMe" },
        link: function(scope, element) {
            scope.$watch("trigger", function(value) {
                    $timeout(function() {
                        element[0].focus();
                    });
            });
        }
    };
});
