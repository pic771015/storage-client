"use strict";

function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}

describe("PublicReadController", function() {
    var PublicReadController, rootScope;

    beforeEach(module("risevision.storage.publicread"));

    beforeEach(module(function ($provide) {
      $provide.service("PublicReadService", function() {
        var svc = {callCount: 0};
        svc.enablePublicRead = function() {
          svc.callCount = svc.callCount + 1;
        };
        return svc;
      });
    }));

    beforeEach(inject(function($injector, $controller) {
      rootScope = $injector.get("$rootScope");

      PublicReadController = $controller("PublicReadController" ,{ $scope: rootScope});
    }));


    it("should be defined", function() {
        expect(PublicReadController).to.exist;
    });

    it("should call the service on event", function() {
      var service = getService("PublicReadService");
      expect(service.callCount).to.equal(0);
      rootScope.$broadcast("storage-client:company-id-changed");
      expect(service.callCount).to.equal(1);
    });
});

