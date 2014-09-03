"use strict";
function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}

function setupMocks(servicesPassFail) {
  return function($provide) {
    $provide.service("OAuthStatusService", function() {
      var service = {};

      service.getAuthStatus = function () {
        return (servicesPassFail.auth ? new Q("true") : Q.reject("no auth"));
      };
      return service;
    });

    $provide.service("GAPIRequestService", function() {
      var service = {gapiRequestCallCount: 0};

      service.executeRequest = function () {
        service.gapiRequestCallCount += 1;
        return servicesPassFail.uri ?
        {message: "theURI"} : {result: false}; 
      };
      return service;
    });

    $provide.service("$q", function() {
      return Q;
    });
  };
}

describe("Services: Upload URI Service", function () {
  beforeEach(module("medialibrary"));

  describe("With successful uri request", function() {
    beforeEach(module(setupMocks({uri: true, auth: true})));

    it("should exist", function() {
      var uploadService = getService("UploadURIService");
      expect(uploadService).to.exist;
      expect(uploadService.getURI).to.exist;
    });

    it("should get an upload url", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI("anyCompanyId", "anyFileName")
      .then(function (receivedURI) {
        expect(receivedURI).to.equal("theURI");
      });
    });
  });

  describe("With failed uri request", function() {
    beforeEach(module(setupMocks({uri: false, auth: true})));

    it("should return a false result", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI("anyCompanyId", "anyFileName")
      .then(assert("false"), function (resp) {
        expect(resp.result).to.equal(false);
      });
    });
  });

  describe("With failed auth request", function() {
    beforeEach(module(setupMocks({uri: true, auth: false})));

    it("should be rejected", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI("anyCompanyId", "anyFileName")
      .then(function(){assert(false);}, function () {assert(true);});
    });

    it("should not have called getResumableUploadURI", function() {
      var uploadService = getService("UploadURIService");
      var gapiService = getService("GAPIRequestService");
      uploadService.getURI("anyCompanyId", "anyFileName");
      expect(gapiService.gapiRequestCallCount).to.equal(0);
    });
  });
});
