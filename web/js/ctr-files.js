"use strict";
/* global gadgets: true */

angular.module("medialibrary").controller("FileListCtrl",
["$scope", "$route", "$routeParams", "$location", "FileListService",
"OAuthAuthorizationService", "GAPIRequestService", "OAuthStatusService",
"$window","MEDIA_LIBRARY_URL",
function ($scope, $route, $routeParams, $location, listSvc,
OAuthAuthorizationService, requestSvc, OAuthStatusService,
$window, MEDIA_LIBRARY_URL) {
  var bucketName = "risemedialibrary-" + $routeParams.companyId;
  var bucketUrl = MEDIA_LIBRARY_URL + bucketName + "/";
  $scope.$location = $location;
  $scope.isAuthed = true;
  $scope.orderByAttribute = "name";
  $scope.filesDetails = listSvc.filesDetails;
  $scope.statusDetails = listSvc.statusDetails;

  $scope.dateModifiedOrderFunction = function(file) {
    return file.updated ? file.updated.value : "";
  };

  $scope.login = function() {
    OAuthAuthorizationService.authorize().then(function() {
      $scope.isAuthed = true;
      listSvc.refreshFilesList($routeParams.companyId, $routeParams.folder);
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
    listSvc.refreshFilesList($routeParams.companyId, $routeParams.folder)
    .then(function(resp) {
      if (resp.code === 404) {$scope.createBucket();}
    });
  }, function() { $scope.isAuthed = false; });

  $scope.createBucket = function() {
    var gapiPath = "storage.createBucket";
    requestSvc.executeRequest(gapiPath, {"companyId": $routeParams.companyId})
    .then(function() {
      listSvc.refreshFilesList($routeParams.companyId);
    });
  };
	
  $scope.fileCheckToggled = function(file) {
    $scope.filesDetails.checkedCount += file.isChecked ? 1 : -1;

    if (file.name.substr(-1) === "/") {
      $scope.filesDetails.folderCheckedCount += file.isChecked ? 1 : -1;
    }
  };

  $scope.selectAllCheckboxes = function() {
    for ( var i = 0; i < $scope.filesDetails.files.length; ++i ) {
      if (!$scope.fileIsCurrentFolder($scope.filesDetails.files[i])) {
        $scope.filesDetails.files[ i ].isChecked = $scope.selectAll;
      }
    }
  };

  $scope.fileIsCurrentFolder = function(file) {
    return file.name === $routeParams.folder + "/";
  };

  $scope.fileIsFolder = function(file) {
    return file.name.substr(-1) === "/";
  };

  $scope.$on("FileSelectAction", function(event, file) {
    var fileUrl = bucketUrl + file.name;
    var data = { params: fileUrl };

    if ($scope.fileIsCurrentFolder(file)) {
      $scope.$location.path("/files/" + $routeParams.companyId); 
    } else if ($scope.fileIsFolder(file)) {
      $scope.$location
        .path("/files/" + $routeParams.companyId + 
            "/folder/" + file.name);
    } else {
      $window.parent.postMessage([fileUrl], "*");
      gadgets.rpc.call("", "rscmd_saveSettings", null, data);
    }
  });
}]);
