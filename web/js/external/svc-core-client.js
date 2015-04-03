"use strict";

angular.module("risevision.storage.external", ["risevision.storage.gapi"])
.factory("CoreClientService", ["$q", "GAPIRequestService", "OAuthAuthorizationService",
function($q, requestor, oauth) {
  var svc = { company: null };
  var companyDeferred = null;
  
  svc.getCompany = function(companyId) {
  	if(companyDeferred) {
  	  return companyDeferred.promise;
  	}
  	else {
  	  companyDeferred = $q.defer();
  	}
  	
  	if(svc.company === null || svc.company.id !== companyId) {
      oauth.authorize(true).then(function() {
        requestor.executeRequest("core.company.get", { id: companyId }).then(function(company) {
          svc.company = company;
          companyDeferred.resolve(svc.company);
        },
        function() {
          console.log("Error loading company information");
          companyDeferred.reject();
        });
      }, function() {
        console.log("Error authenticating user");
        companyDeferred.reject();
      });
  	}
  	else {
  	  companyDeferred.resolve(svc.company);
  	}

  	return companyDeferred.promise;
  };

  return svc;
}]);
