"use strict";
/* global handleClientJSLoad: false */
/* jshint unused: false */
function handleClientJSLoad() {
  console.log("Google JS client is loaded");
  angular.element(document).ready(function() {
    angular.element(document).injector()
    .invoke(["gapiClientService", "$window", "STORAGE_URL", "$q", "$log",
             "cookieTester",
    function(gapiClient, $window, STORAGE_URL, $q, $log, cookieTester) {
      return cookieTester.checkCookies()
             .then(function() {
               return loadStorageClient();
             })
             .then(function() {
                return gapiClient.fulfill($window.gapi.client);
              })
             .then(null, function() {console.log("Cookie check error");});;

      function loadStorageClient() {
        var defer = $q.defer();
        $window.gapi.client.load("storage", "v0.01", function () {
          if ($window.gapi.client.storage) {
            $log.info("Storage API is loaded");
            defer.resolve();
          } else {
            $log.error("Storage API is NOT loaded");
            defer.reject();
          }
        }, STORAGE_URL);

        return defer.promise;
      }
    }]);
  });
}
angular.module("gapi", [])
.factory("gapiClientService", ["$q", function ($q) {
  var svc = {};
  var defer = $q.defer();
  svc.get= function () {
    return defer.promise;
  };
  svc.fulfill = function(gapiClient) {
    return defer.resolve(gapiClient);
  };
  return svc;
}]);
