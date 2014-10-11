"use strict";
angular.module("medialibrary")
.factory("UploadURIService", ["$q", "GAPIRequestService", "OAuthStatusService", "$stateParams", "$interpolate", "$translate",
function uploadURIService ($q, gapiRequestor, OAuthService, $stateParams, $interpolate, $translate) {
  var svc = {};

  var uriFailed = "storage-client.upload-uri-request-failed";
  var uriFailedMail = "storage-client.upload-uri-request-failed-mail";

  $translate([uriFailed, uriFailedMail], { mail: "{{mail}}" }).then(function(values) {
    uriFailed = values[uriFailed];
    uriFailedMail = $interpolate(values[uriFailedMail]);
  });

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
        resp.message = resp.userEmail ? uriFailedMail(resp.userEmail)
                                      : uriFailed;
        return $q.reject(resp);
      } else {
        return resp.message;
      }
    });
  };

  return svc;
}]);
