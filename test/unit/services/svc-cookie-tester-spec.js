"use strict";
var httpRequestHandler, $httpBackend;

function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}

function mockQ() {
  return function($provide) {
    $provide.service("$q", function() {
      return Q;
    });
  };
}

function mockHttp(resp) {
  return function($provide) {
    $provide.service("$http", function() {
      return {get: function() {return Q.when({data: {check: resp}})}};
    });
  };
}

describe("Services: Cookies", function() {
  beforeEach(module("cookieTester"));
  beforeEach(module(mockQ()));

  describe("With failed third party cookie", function() {
    beforeEach(module(mockHttp("false")));

    it("should fail on bad third party cookie", function() {
      var cookieService = getService("cookieTester");

      return cookieService.checkThirdPartyCookiePermission()
      .then(function() {assert(false);}, function(resp) {
        expect(resp).to.equal(false);
      }); 
    });

    it("should fail on bad third party cookie", function() {
      var cookieService = getService("cookieTester");

      return cookieService.checkCookies()
      .then(function() {assert(false);}, function(resp) {
        expect(resp).to.equal(false);
      }); 
    });
  });

  describe("With successful third party cookie", function() {
    beforeEach(module(mockHttp("true")));

    it("should pass", function() {
      var cookieService = getService("cookieTester");

      return cookieService.checkCookies()
      .then(function() {expect(cookieService.status.passed).to.equal(true);}
           ,function() {assert(false);});
    });
  });
});

