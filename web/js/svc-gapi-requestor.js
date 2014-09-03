"use strict";
angular.module("medialibraryServices").factory("GAPIRequestService",
["$q", "gapiClientService", function($q, gapiClient) {
  var svc = {};
  svc.executeRequest = function executeRequest(requestPath, paramObject) {
    var deferred = $q.defer();
    requestPath = requestPath.split(".");

    gapiClient.get().then(function(gapiClient) {
      var request = gapiClient;
      requestPath.forEach(function(obj) {
        request = request[obj];
      });
      request(paramObject).execute(function(resp) {
        deferred.resolve(resp);
      });
    });
    return deferred.promise;
  };
  return svc;
}]);
