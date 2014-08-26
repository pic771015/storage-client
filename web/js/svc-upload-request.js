"use strict";
angular.module("medialibrary")
.factory("UploadURIService", ["$q", "storageAPILoader", "OAuthService",
function uploadURIService ($q, storageAPILoader, OAuthService) {
  var svc = {};
  svc.getURI = function getURI(companyId, fileName) {
    if (!companyId || !fileName) {return $q.when(new Error("Invalid Params"));}

    return $q.all([storageAPILoader.get(), OAuthService.getAuthStatus()])
    .then(function(results) {
      var storageApi = results[0];
      var params = {"companyId": companyId, "fileName": fileName};
      return executeRequest(storageApi.getResumableUploadURI(params));
    })
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
