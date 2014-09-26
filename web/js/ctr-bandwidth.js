"use strict";
angular.module("medialibrary")
  .controller("BandwidthController",
  ["$scope", "$stateParams", "BandwidthService",
  function ($scope, $stateParams, bandwidthService) {
    $scope.bandwidthUse = undefined;

    (function getBandwidth() {
      bandwidthService.getBandwidth($stateParams.companyId)
      .then(function(resp) {
        $scope.bandwidthUse = resp;
      });
    }());
  }
]);
