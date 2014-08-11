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
      var service = {authCheckCount: 0};

      service.getAuthStatus = function () {
        service.authCheckCount += 1;
        return (servicesPassFail.auth ? new Q("true") : Q.reject("no auth"));
      };
      return service;
    });

    $provide.service("storageAPILoader", function() {
      var service = {bandwidthCallCount: 0};

      service.get = function () {
        return (servicesPassFail.storage ? new Q({getBucketBandwidth: function(params) {
          return {execute: function(cb) {
            service.bandwidthCallCount += 1;
            return cb({result:servicesPassFail.bandwidth,message:10});
          }};
        }}) : Q.reject("storage api load rejected"));
      };
      return service;
    });

    $provide.service("$q", function() {
      return Q;
    });
  };
}

describe("Services: Bandwidth", function() {
  beforeEach(module("medialibrary"));

  describe("With successful bandwith result", function() {
    beforeEach(module(setupMocks({bandwidth: true, auth: true, storage: true})));

    it("should reject if no companyId", function() {
      var bandwidthService = getService("BandwidthService");
      return bandwidthService.getBandwidth()
      .then(function() {assert(false);}, function(resp) {
        expect(resp).to.equal("No companyId");
      }); 
    });

    it("should get bandwidth", function() {
      var bandwidthService = getService("BandwidthService");
      return bandwidthService.getBandwidth("Some companyId")
      .then(function(resp) {
        expect(resp).to.equal("less than one");
      }, function() {assert(false);});
    });

    it("should execute a request only on first call", function() {
      var bandwidthService = getService("BandwidthService");
      var storageAPILoader = getService("storageAPILoader");
      expect(storageAPILoader.bandwidthCallCount).to.equal(0);
      return bandwidthService.getBandwidth("Some companyId")
      .then(function() {
        expect(storageAPILoader.bandwidthCallCount).to.equal(1);
      }).then(function() {
        return bandwidthService.getBandwidth("Some companyId");
      }).then(function() {
        expect(storageAPILoader.bandwidthCallCount).to.equal(1);
      });
    });
  });

  describe("With failed bandwith result", function() {
    beforeEach(module(setupMocks({bandwidth: false, auth: true, storage: true})));

    it("should reject with false result", function() {
      var bandwidthService = getService("BandwidthService");
      return bandwidthService.getBandwidth("Some companyId")
      .then(function() {assert(false);}, function(resp) {
        expect(resp.result).to.equal(false);
      }); 
    });
  });

  describe("With failed auth result", function() {
    beforeEach(module(setupMocks({bandwidth: true, auth: false, storage: true})));

    it("should reject with no auth message", function() {
      var bandwidthService = getService("BandwidthService");
      return bandwidthService.getBandwidth("Some companyId")
      .then(function() {assert(false);}, function(resp) {
        expect(resp).to.equal("no auth");
      }); 
    });
  });
});

