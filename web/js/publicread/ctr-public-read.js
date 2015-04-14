"use strict";

angular.module("risevision.storage.publicread")
.controller("PublicReadController",
["$scope", "$rootScope", "$stateParams", "PublicReadService",
function ($scope, $rootScope, $stateParams, publicReadSvc) {
  $scope.companyId = $stateParams.companyId;

  $rootScope.$on("storage-client:company-id-changed", function(event, companyId) {
    publicReadSvc.enablePublicRead(companyId);
  });
}]);
