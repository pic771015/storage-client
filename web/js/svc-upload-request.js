"use strict";
angular.module("medialibrary")
.factory("UploadURIService", ["$q", "GAPIRequestService", "OAuthStatusService",
function uploadURIService ($q, gapiRequestor, OAuthService) {
  var svc = {};
  svc.getURI = function getURI(companyId, fileName) {
    if (!companyId || !fileName) {return $q.reject("Invalid Params");}

    return OAuthService.getAuthStatus()
    .then(function() {
      var gapiPath = "storage.getResumableUploadURI";
      var params = {"companyId": companyId, "fileName": fileName};
      return gapiRequestor.executeRequest(gapiPath,params);
    })
    .then(function(resp) {
      if (resp.result === false) {
        return $q.reject(resp);
      } else {
        return resp.message;
      }
    });
  };

  return svc;
}]);
