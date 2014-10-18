"use strict";
angular.module("cookieTester").controller("cookieTesterController", ["cookieTester",
function(cookieTester) {
  this.status = cookieTester.status;
}]);
