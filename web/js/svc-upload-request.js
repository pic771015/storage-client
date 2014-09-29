"use strict";
angular.module("medialibrary")
.factory("UploadURIService", ["$q", "GAPIRequestService", "OAuthStatusService", "$stateParams",
function uploadURIService ($q, gapiRequestor, OAuthService, $stateParams) {
  var svc = {};
  svc.getURI = function getURI(file) {
    if (!$stateParams.companyId || !file.name) {
      return $q.reject("Invalid Params");
    }

    return OAuthService.getAuthStatus()
    .then(function() {
      var gapiPath = "storage.getResumableUploadURI";
      var params = {"companyId": $stateParams.companyId,
                    "fileName": encodeURIComponent(file.name),
                    "fileType": file.type};
      return gapiRequestor.executeRequest(gapiPath,params);
    })
    .then(function(resp) {
      if (resp.result === false) {
        resp.message = resp.userEmail ? resp.message + " for " + resp.userEmail
                                      : resp.message;
        return $q.reject(resp);
      } else {
        return resp.message;
      }
    });
  };

  return svc;
}]);
