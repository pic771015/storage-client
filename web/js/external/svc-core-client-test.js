"use strict";

function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}

describe("CoreClientService", function() {
    var CoreClientService, $rootScope;

    beforeEach(module("risevision.storage.external"));

    beforeEach(module(function ($provide) {
      $provide.service("OAuthAuthorizationService", function($q) {
        var svc = {};
        svc.authorize = function() {
          return $q.when();
        };
        return svc;
      });

      $provide.service("GAPIRequestService", function($q) {
        var svc = {};
        svc.executeRequest = function(method, company) {
          if(company.id === 1) {
            return $q.when({ id: company.id, name: "Test name" });
          }
          else {
            return $q.reject();
          }
        };
        return svc;
      });
    }));

    beforeEach(inject(function($injector, _$rootScope_) {
      // To avoid translation files loading errors
      var $httpBackend = $injector.get("$httpBackend");
      $httpBackend.whenGET(/\.*/).respond(200, {});

      $rootScope = _$rootScope_;
      CoreClientService = getService("CoreClientService");
    }));

    it("should be defined", function() {
        expect(CoreClientService).to.exist;
    });

    it("should get a valid company", function() {
      var cb = sinon.spy();

      CoreClientService.getCompany(1).then(cb);

      $rootScope.$apply();

      expect(cb.called).to.be.true;
      expect(cb.args[0][0].id).to.equal(1);
      expect(cb.args[0][0].name).to.equal("Test name");
    });

    it("should fail to get a company", function() {
      var cb = sinon.spy();
      var fail = sinon.spy();
      CoreClientService.getCompany(2).then(cb, fail);

      $rootScope.$apply();

      expect(cb.called).to.be.false;
      expect(fail.called).to.be.true;
    });
});
