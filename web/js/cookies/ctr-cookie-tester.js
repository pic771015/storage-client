"use strict";
angular.module("risevision.storage.cookie").controller("cookieTesterController", ["cookieTester",
function(cookieTester) {
  this.status = cookieTester.status;
}]);
