"use strict";
/* global gadgets: true */

angular.module("medialibrary")
.controller("ModalWindowController", ["$scope", function($scope) {
  $scope.closeButtonClick = function() {
    gadgets.rpc.call("", "rscmd_closeSettings", null);
  };
}])
.controller("ButtonsController",
            ["$scope", "$rootScope", "$routeParams",
            function ($scope, $rootScope, $routeParams) {
  $scope.downloadDisabled = true;
  $scope.uploadDisabled = false;
  $scope.deleteDisabled = true;	
  $scope.newFolderDisabled = ($routeParams.folder ? true : false);

  $scope.$on("CheckedCountChange", function(event, count, folder) {
    $scope.downloadDisabled = count !== 1 || folder;
    $scope.deleteDisabled = !count;
    $scope.selectDisabled = !count;
    $scope.uploadDisabled = count;
  });

  $scope.cancelButtonClick = function() {
    $rootScope.$broadcast("CancelSelectAction");
  };

  $scope.uploadButtonClick = function() {
    $("#file").click();
  };

  $scope.downloadButtonClick = function() {
    $rootScope.$broadcast("FileDownloadAction");
  };

  $scope.deleteButtonClick = function() {
    $rootScope.$broadcast("FileDeleteAction");
  };

  $scope.selectButtonClick = function() {
    $rootScope.$broadcast("SelectorButtonAction");
  };

  $scope.newFolderButtonClick = function() {
    $rootScope.$broadcast("NewFolderAction");
  };
}]);
