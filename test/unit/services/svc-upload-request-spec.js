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

    $provide.service("$stateParams", function() {
      return servicesPassFail.state ? {companyId: "13245"} : {};
    });

    $provide.provider("$translate", function() {
      var service = {};

      service.$get = function() {
      	var fun = function(key) {
          return {
            then: function() {
              return key;
            }
          };
      	};

        fun.storage = function() {
        	return null;
        };

        fun.storageKey = function(key) {
        	return key;
        };

        fun.preferredLanguage = function() {
        	return "en";
        };

        fun.use = function() {

        };

      	return fun;
      };

      return service;
    });
  };
}

describe("Services: Upload URI Service", function () {
  beforeEach(module("medialibrary"));

  describe("With successful uri request", function() {
    beforeEach(module(setupMocks({uri: true, auth: true, state: true})));

    it("should exist", function() {
      var uploadService = getService("UploadURIService");
      expect(uploadService).to.exist;
      expect(uploadService.getURI).to.exist;
    });

    it("should get an upload url", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI({name: "filename", type: ""})
      .then(function (receivedURI) {
        expect(receivedURI).to.equal("theURI");
      });
    });
  });

  describe("With failed uri request", function() {
    beforeEach(module(setupMocks({uri: false, auth: true, state: true})));

    it("should return a false result", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI({name: "filename", type: ""})
      .then(assert("false"), function (resp) {
        expect(resp.result).to.equal(false);
      });
    });
  });

  describe("With failed auth request", function() {
    beforeEach(module(setupMocks({uri: true, auth: false, state: true})));

    it("should be rejected", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI({name: "filename", type: ""})
      .then(function(){assert(false);}, function () {assert(true);});
    });

    it("should not have called getResumableUploadURI", function() {
      var uploadService = getService("UploadURIService");
      var gapiService = getService("GAPIRequestService");
      uploadService.getURI({name: "filename", type: ""});
      expect(gapiService.gapiRequestCallCount).to.equal(0);
    });
  });

  describe("With invalid state", function() {
    beforeEach(module(setupMocks({uri: true, auth: true, state: false})));

    it("should reject on no company id", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI({name: "filename", type: ""})
        .then(function(){assert(false);}, function() {assert(true);});
    });
  });

  describe("With invalid parameter", function() {
    beforeEach(module(setupMocks({uri: true, auth: true, state: true})));

    it("should reject on no file name", function() {
      var uploadService = getService("UploadURIService");
      return uploadService.getURI({})
        .then(function(){assert(false);}, function() {assert(true);});
    });
  });
});
