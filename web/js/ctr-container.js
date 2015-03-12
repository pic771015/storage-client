"use strict";

angular.module("medialibrary")
.controller("modalContainerController",
["$scope", "calloutClosingService", function($scope, calloutClosingService) {
  $scope.closeThrottleNotice = function() {
    calloutClosingService.closeCallout();
  };
}]);
