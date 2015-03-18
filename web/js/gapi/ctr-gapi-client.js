"use strict";
angular.module("risevision.storage.gapi").controller("gapiClientController", ["gapiClientService",
function(gapiSvc) {
  this.gapiClientFullyLoaded = false;
  gapiSvc.get().then(angular.bind(this, function() {
    console.log("Google JS client fully loaded");
    this.gapiClientFullyLoaded = true;
  }));
}]);
