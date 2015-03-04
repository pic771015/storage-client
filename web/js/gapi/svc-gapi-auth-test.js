/*jshint expr:true */

describe("Services: apiAuth", function() {
  "use strict";

  beforeEach(module("risevision.storage.gapi"));

  it("should exist", function(done) {
    inject(function(OAuthAuthorizationService) {
      expect(OAuthAuthorizationService).be.defined;
      done();
    });
  });
});
