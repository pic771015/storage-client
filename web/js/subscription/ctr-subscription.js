"use strict";

angular.module("risevision.storage.subscription", [])
.controller("SubscriptionStatusController", ["$scope", "$rootScope", "STORE_PRODUCT_CODE", "STORE_PRODUCT_ID", "$stateParams",
function ($scope, $rootScope, STORE_PRODUCT_CODE, STORE_PRODUCT_ID, $stateParams) {
  $scope.companyId = $stateParams.companyId;
  $scope.productCode = STORE_PRODUCT_CODE;
  $scope.productId = STORE_PRODUCT_ID;
  $scope.subscriptionStatus = {};

  $rootScope.$on("storage-client:company-id-changed", function(event, companyId) {
  	$scope.companyId = companyId || $scope.companyId;
  });
}]);
