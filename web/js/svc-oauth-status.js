"use strict";
angular.module("medialibrary").factory("OAuthStatusService", ["OAuthAuthorizationService",
function oAuthService(authSvc) {
  var service = {}
     ,authPromise;

  service.getAuthStatus = function() {
    if (authPromise !== undefined) {
      return authPromise;
    }

    authPromise = authSvc.authorize(true).then(function (authResult) {
      console.log("Application has user's oAuth permission.");
      return authResult;
    }, function(authResult) {
      console.log("Application does not have user's oAuth permission.");
      throw authResult;
    });
    return authPromise;
  };

  return service;
}]);
