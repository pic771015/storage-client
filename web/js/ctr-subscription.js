"use strict";

angular.module("medialibrary").controller("SubscriptionStatusController", ["$scope", "STORE_PRODUCT_CODE", "STORE_PRODUCT_ID", "$stateParams",
function ($scope, STORE_PRODUCT_CODE, STORE_PRODUCT_ID, $stateParams) {
  $scope.companyId = $stateParams.companyId;
  $scope.productCode = STORE_PRODUCT_CODE;
  $scope.productId = STORE_PRODUCT_ID;
  $scope.subscriptionStatus = {};
}]);
