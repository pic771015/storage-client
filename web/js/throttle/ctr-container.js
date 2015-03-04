"use strict";

angular.module("risevision.storage.throttle")
.controller("modalContainerController",
["$scope", "calloutClosingService", function($scope, calloutClosingService) {
  $scope.closeThrottleNotice = function() {
    calloutClosingService.closeCallout();
  };
}]);
