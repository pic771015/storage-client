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
    $provide.service("OAuthService", function() {
      var service = {};

      service.getAuthStatus = function () {
        return (servicesPassFail.auth ? new Q("true") : Q.reject("no auth"));
      };
      return service;
    });

    $provide.service("storageAPILoader", function() {
      var service = {uploadURICallCount: 0};

      service.get = function () {
        return (servicesPassFail.storage ? new Q({getResumableUploadURI: function() {
          service.uploadURICallCount = 1;
          return {execute: function(cb) {
            return cb({result:servicesPassFail.uri,message:"theURI"});
          }};
        }}): Q.reject("storage api load rejected"));
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
    beforeEach(module(setupMocks({uri: true, auth: true, storage: true})));

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
    beforeEach(module(setupMocks({uri: false, auth: true, storage: true})));

    it("should be rejected with false result", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI("anyCompanyId", "anyFileName")
      .then(null, function (resp) {
        expect(resp.result).to.equal(false);
      });
    });
  });

  describe("With failed auth request", function() {
    beforeEach(module(setupMocks({uri: true, auth: false, storage: true})));

    it("should be rejected", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI("anyCompanyId", "anyFileName")
      .then(function(){assert(false);}, function () {assert(true);});
    });

    it("should not have called getResumableUploadURI", function() {
      var uploadService = getService("UploadURIService");
      var storageAPIService = getService("storageAPILoader");
      uploadService.getURI("anyCompanyId", "anyFileName");
      expect(storageAPIService.uploadURICallCount).to.equal(0);
    });
  });

  describe("With failed storage api loader request", function() {
    beforeEach(module(setupMocks({uri: true, auth: true, storage: false})));

    it("should be rejected", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI("anyCompanyId", "anyFileName")
      .then(function(){assert(false);}, function () {assert(true);});
    });

    it("should not have called getResumableUploadURI", function() {
      var uploadService = getService("UploadURIService");
      var storageAPIService = getService("storageAPILoader");
      uploadService.getURI("anyCompanyId", "anyFileName");
      expect(storageAPIService.uploadURICallCount).to.equal(0);
    });
  });
});
