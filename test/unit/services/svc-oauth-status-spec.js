describe("Services: OAuthStatusService", function() {
  "use strict";
  var oAuthStatusService;

  beforeEach(function() {
    module("medialibrary");

    var authorizationServiceMock = {};

    module(function($provide) {
      $provide.value("OAuthAuthorizationService", authorizationServiceMock);
    });

    inject(function($q, OAuthStatusService) {
      oAuthStatusService = OAuthStatusService;
    });

    authorizationServiceMock.callCount = 0;

    authorizationServiceMock.authorize = function() {
      authorizationServiceMock.callCount += 1;
      return new Q(true);
    };
  });

  describe("With positive response", function() {

    it("should pass the result", inject(function() {
      return oAuthStatusService.getAuthStatus().then(function() {
        assert(true);
      });
    }));

    it("should not seek authorization on subsequent calls",
        inject(function(OAuthAuthorizationService) {
      return oAuthStatusService.getAuthStatus()
      .then(function() {
        return oAuthStatusService.getAuthStatus();
      }).then(function() {
        expect(OAuthAuthorizationService.callCount).to.equal(1);
      });
    }));
  });
});
