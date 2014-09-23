"use strict";

angular.module("medialibrary").controller("SubscriptionStatusController", ["$scope", "$route", "$routeParams", "STORE_PRODUCT_CODE", "STORE_PRODUCT_ID",
function ($scope, $route, $routeParams, STORE_PRODUCT_CODE, STORE_PRODUCT_ID) {
  $scope.companyId = $routeParams.companyId;
  $scope.productCode = STORE_PRODUCT_CODE;
  $scope.productId = STORE_PRODUCT_ID;
  $scope.subscriptionStatus = {};
}]);
