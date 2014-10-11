"use strict";
angular.module("medialibrary")
.factory("BandwidthService",
["$q", "OAuthStatusService", "GAPIRequestService", "$translate",
function bandwidthFactory($q, OAuthStatusService, requestService, $translate) {
  var service = {}
     ,bandwidthValuesPromiseCache = {};

  service.getBandwidth = function(companyId) {
    if (!companyId) {return $q.reject("No companyId");}

    if (bandwidthValuesPromiseCache.hasOwnProperty(companyId)) {
      return bandwidthValuesPromiseCache[companyId];
    }

    bandwidthValuesPromiseCache[companyId] =
    OAuthStatusService.getAuthStatus()
    .then(function() {
      var params = {"companyId": companyId};
      return requestService.executeRequest("storage.getBucketBandwidth", params)
            .then(function(resp) {
              if (resp.result === false && resp.message) {
                return $translate("storage-client." + resp.message);
              }
              else if (resp.result === false || !resp.message) {
                console.log("Bandwidth unavailable");
                throw resp;
              }
              else {
                return resp.message;
              }
            });
    });

    return bandwidthValuesPromiseCache[companyId];
  };

  return service;
}]);
