"use strict";

angular.module("risevision.storage.modal", [])
.controller("ModalWindowController", ["$scope", "FULLSCREEN",
function($scope, FULLSCREEN) {
  $scope.FULLSCREEN = FULLSCREEN;

  $scope.closeButtonClick = function() {
    gadgets.rpc.call("", "rscmd_closeSettings", null);
  };
}]);
