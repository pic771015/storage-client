"use strict";
/* global gadgets: true */

angular.module("medialibrary").controller("FileListCtrl",
["$scope", "$stateParams", "$location", "FileListService",
"OAuthAuthorizationService", "GAPIRequestService", "OAuthStatusService",
"$window","MEDIA_LIBRARY_URL", "$state",
function ($scope, $stateParams, $location, listSvc,
OAuthAuthorizationService, requestSvc, OAuthStatusService,
$window, MEDIA_LIBRARY_URL, $state) {
  var bucketName = "risemedialibrary-" + $stateParams.companyId;
  var bucketUrl = MEDIA_LIBRARY_URL + bucketName + "/";
  $scope.$location = $location;
  $scope.isAuthed = true;
  $scope.orderByAttribute = "name";
  $scope.filesDetails = listSvc.filesDetails;
  $scope.statusDetails = listSvc.statusDetails;
  $scope.bucketCreationStatus = {code: 202};
  $scope.currentDecodedFolder = $stateParams.folderPath ? 
                                decodeURIComponent($stateParams.folderPath) : undefined;

  $scope.dateModifiedOrderFunction = function(file) {
    return file.updated ? file.updated.value : "";
  };

  $scope.login = function() {
    OAuthAuthorizationService.authorize().then(function() {
      $scope.isAuthed = true;
      listSvc.refreshFilesList();
    })
    .then(null, function(errResult) {
      console.log(errResult);
    });
  };

  $scope.fileExtOrderFunction = function(file) {
    return file.name.substr(-1) === "/" ?
           "Folder" :
           file.name.split(".").pop();
  };

  $scope.fileSizeOrderFunction = function(file) {
    return Number(file.size);
  };

  OAuthStatusService.getAuthStatus().then(function() {
    $scope.isAuthed = true;
    listSvc.refreshFilesList().then(function() {
        $scope.$broadcast("files-refreshed", "");
      });
  }, function() { $scope.isAuthed = false; });

  $scope.createBucket = function() {
    var gapiPath = "storage.createBucket";
    requestSvc.executeRequest(gapiPath, {"companyId": $stateParams.companyId})
    .then(function(resp) {
      $scope.bucketCreationStatus = resp;
      listSvc.refreshFilesList();
    });
  };
	
  $scope.fileCheckToggled = function(file) {
    if (file.name.substr(-1) !== "/") {
      $scope.filesDetails.checkedCount += file.isChecked ? 1 : -1;
    } else {
      $scope.filesDetails.folderCheckedCount += file.isChecked ? 1 : -1;
    }
  };

  $scope.selectAllCheckboxes = function() {
    $scope.filesDetails.checkedCount = 0;
    $scope.filesDetails.folderCheckedCount = 0;
    for ( var i = 0; i < $scope.filesDetails.files.length; ++i ) {
      if ($scope.fileIsCurrentFolder($scope.filesDetails.files[i])) {continue;}
      $scope.filesDetails.files[i].isChecked = $scope.selectAll;
      if ($scope.filesDetails.files[i].name.substr(-1) !== "/") {
        $scope.filesDetails.checkedCount += $scope.selectAll ? 1 : 0;
      } else {
        $scope.filesDetails.folderCheckedCount += $scope.selectAll ? 1 : 0;
      }
    }
  };

  $scope.fileIsCurrentFolder = function(file) {
    return file.name === $scope.currentDecodedFolder;
  };

  $scope.fileIsFolder = function(file) {
    return file.name.substr(-1) === "/";
  };

  $scope.$on("FileSelectAction", function(event, file) {
    var fileUrl = bucketUrl + file.name;
    var data = { params: fileUrl };

    if ($scope.fileIsFolder(file)) {
      if ($scope.fileIsCurrentFolder(file)) {
        var folderPath = $scope.currentDecodedFolder.split("/");
        folderPath = folderPath.length > 2 ?
                     folderPath.slice(0, -2).join("/") + "/" : "";
        $state.go(folderPath ? "main.company-folders" : "main.company-root",
                  {folderPath: folderPath, companyId: $stateParams.companyId});
      } else {
        $state.go("main.company-folders",
                  {folderPath: file.name, companyId: $stateParams.companyId});
      }
    } else {
      $window.parent.postMessage([fileUrl], "*");
      gadgets.rpc.call("", "rscmd_saveSettings", null, data);
    }
  });
}]);
