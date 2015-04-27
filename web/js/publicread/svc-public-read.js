"use strict";
angular.module("risevision.storage.publicread", ["risevision.storage.oauth", "risevision.storage.gapi", "ui.router"])
.factory("PublicReadService",
["OAuthStatusService", "GAPIRequestService",
function publicReadFactory(OAuthStatusService, requestService) {
  var service = {}
     ,companyCache = [];

  service.enablePublicRead = function(companyId) {
    if (!companyId) {return;}

    if (companyCache.indexOf(companyId) >= 0) {
      return;
    }

    companyCache.push(companyId);

    return OAuthStatusService.getAuthStatus()
    .then(function() {
      var params = {"companyId": companyId};
      return requestService.executeRequest("storage.enablePublicRead", params);
    })
    .then(null, function() {
      companyCache = companyCache.filter(function(val) {
        val !== companyId;
      });
      throw new Error("PublicReadService error");
    });
  };

  return service;
}]);
