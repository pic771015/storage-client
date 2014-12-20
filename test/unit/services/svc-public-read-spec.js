/*jshint expr:true */
"use strict";
function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}


describe("Services: EnablePublicRead", function() {
  beforeEach(module("medialibrary"));

  beforeEach(module(function ($provide) {
    $provide.service("OAuthStatusService", function() {
      var svc = {"callCount": 0};
      svc.getAuthStatus = function() {
        svc.callCount += 1;
        return new Q();
      };

      return svc;
    });

    $provide.service("GAPIRequestService", function() {
      var svc = {};
      svc.executeRequest = function() {
        if (svc.mockedResult === "fail") {
          return Q.reject();
        } else {
          return new Q();
        }
      };

      svc.setResult = function(passfail) {
        svc.mockedResult = passfail;
      };

      return svc;
    });

    $provide.service("$q", function() {
      return Q;
    });
  }));

  it("should exist", function () {
    var publicReadSvc = getService("PublicReadService");
    expect(publicReadSvc).be.defined;
  });

  it("should not call on missing companyId", function () {
    var publicReadSvc = getService("PublicReadService");
    var oAuthSvc = getService("OAuthStatusService");
    publicReadSvc.enablePublicRead();
    expect(oAuthSvc.callCount).to.equal(0);
  });

  it("should call with companyId", function () {
    var publicReadSvc = getService("PublicReadService");
    var oAuthSvc = getService("OAuthStatusService");
    publicReadSvc.enablePublicRead("234");
    publicReadSvc.enablePublicRead("2345");
    expect(oAuthSvc.callCount).to.equal(2);
  });

  it("should not repetitively call on duplicate companyId", function () {
    var publicReadSvc = getService("PublicReadService");
    var oAuthSvc = getService("OAuthStatusService");
    publicReadSvc.enablePublicRead("234");
    publicReadSvc.enablePublicRead("2345");
    publicReadSvc.enablePublicRead("2345");
    expect(oAuthSvc.callCount).to.equal(2);
  });

  it("should remove id from cache on failure", function () {
    var publicReadSvc = getService("PublicReadService");
    var oAuthSvc = getService("OAuthStatusService");
    var requestSvc = getService("GAPIRequestService");
    requestSvc.setResult("fail");
    return publicReadSvc.enablePublicRead("2345")
    .then(null, function() {
      requestSvc.setResult("pass");
      publicReadSvc.enablePublicRead("2345");
      expect(oAuthSvc.callCount).to.equal(2);
    });
  });
});
