"use strict";
angular.module("gapi-auth", ["risevision.common.config", "gapi"])
.service("OAuthAuthorizationService",
["$window", "$interval", "$q", "gapiClientService",
"GAPI_CLIENT_ID", "GAPI_SCOPES",  
function($window, $interval, $q, gapiClient, GAPI_CLIENT_ID, GAPI_SCOPES) {
  var autoRefreshHandle = null;
  var self = this;

  this.authorize = function (silentCheck) {
    var deferred = $q.defer();
    gapiClient.get().then(function () {
      $window.gapi.auth.authorize({client_id: GAPI_CLIENT_ID,
        scope: GAPI_SCOPES,
        immediate: silentCheck },
        function (authResult) {
          if (silentCheck && !authResult.error) {
            autoRefreshHandle = $interval(function(){
              $interval.cancel(autoRefreshHandle);
              self.authorize(true);
            }, 55 * 60 * 1000); //refresh every 55 minutes
          }
          if (authResult.error) {
            deferred.reject(authResult);
          } else {
            deferred.resolve(authResult);
          }
        });
    });
    return deferred.promise;
  };
}]);
