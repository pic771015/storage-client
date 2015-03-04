"use strict";
angular.module("risevision.storage.gapi").factory("GAPIRequestService",
["$q", "gapiClientService", function($q, gapiClient) {
  var svc = {};
  svc.executeRequest = function executeRequest(requestPath, paramObject) {
    requestPath = requestPath.split(".");

    return gapiClient.get().then(function(gapiClient) {
      var request = gapiClient;
      requestPath.forEach(function(obj) {
        request = request[obj];
      });
      return request(paramObject);
    })
    .then(function(resp) {
      return resp.result;
    })
    .then(null, function() {return $q.reject({message: "api error"});});
  };
  return svc;
}]);
