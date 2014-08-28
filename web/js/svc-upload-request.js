"use strict";
angular.module("medialibrary")
.factory("UploadURIService", ["$q", "gapiLoader", "OAuthService",
function uploadURIService ($q, gapiLoader, OAuthService) {
  var svc = {};
  svc.getURI = function getURI(companyId, fileName) {
    if (!companyId || !fileName) {return $q.when(new Error("Invalid Params"));}

    return $q.all([gapiLoader.get(), OAuthService.getAuthStatus()])
    .then(function(results) {
      var gapi = results[0];
      var params = {"companyId": companyId, "fileName": fileName};
      return executeRequest(gapi.client.storage.getResumableUploadURI(params));
    });
  };

  function executeRequest(request) {
    var defer = $q.defer();
    request.execute(function(resp) {
      if (resp.result === false) {
        defer.reject(resp);
      } else {
        defer.resolve(resp.message);
      }
    });
    return defer.promise;
  }
  return svc;
}]);
