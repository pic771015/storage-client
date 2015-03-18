"use strict";
angular.module("risevision.storage.bandwidth", [])
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
              if ((!resp.message && resp.code !== 200) || resp.result === false) {
                console.log("Bandwidth unavailable");
                throw resp;
              }
              else if(resp.message && isNaN(resp.message)) {
                return $translate("storage-client." + resp.message);
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
