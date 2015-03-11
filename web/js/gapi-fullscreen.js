"use strict";
/* jshint unused: false */

angular.module("gapi", ["risevision.common.gapi"])
  .factory("gapiClientService", ["gapiLoader", "$q", "$log",
  "STORAGE_URL", "$location", "$rootScope", "$window", "cookieTester",
  function (gapiLoader, $q, $log, STORAGE_URL, $location, $rootScope, $window, cookieTester) {
    return {
      get: function () {
        var deferred = $q.defer();

        gapiLoader().then(function (gApi) {
          if(gApi.client.storage) {
            deferred.resolve(gApi.client);
          }
          else {
            cookieTester.checkCookies()
              .then(function() {
                gApi.client.load("storage", "v0.01", function () {
                  if (gApi.client.storage) {
                    $log.debug("Storage API Loaded");
                    deferred.resolve(gApi.client);
                  } else {
                    var errMsg = "Storage API Load Failed";
                    $log.debug(errMsg);
                    deferred.reject(errMsg);
                  }
                }, STORAGE_URL);
              })
              .then(null, function() {
                console.log("Cookie check error");
              });
          }
        });

        return deferred.promise;
      }
    };
  }]);
