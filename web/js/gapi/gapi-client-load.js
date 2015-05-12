"use strict";
/* jshint unused: false */

angular.module("risevision.storage.gapi", ["risevision.common.gapi", "risevision.common.config"])
  .factory("gapiClientService", ["gapiLoader", "$q", "$log",
  "STORAGE_URL", "CORE_URL", "$location", "$rootScope", "$window", "cookieTester",
  function (gapiLoader, $q, $log, STORAGE_URL, CORE_URL, $location, $rootScope, $window, cookieTester) {
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
                var coreDeferred = $q.defer();

                gApi.client.load("core", "v1", function () {
                  if (gApi.client.core) {
                    $log.debug("Core API Loaded");
                    coreDeferred.resolve(gApi.client);
                  } else {
                    var errMsg = "Core API Load Failed";
                    coreDeferred.reject(errMsg);
                  }
                }, CORE_URL);

                return coreDeferred.promise;
              })
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
