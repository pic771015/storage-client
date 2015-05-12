/*jshint expr:true */

describe("Services: apiAuth", function() {
  "use strict";

  beforeEach(module("risevision.storage.gapi"));

  beforeEach(module(function ($provide) {
    $provide.service("gapiClientService", function() {
      return {};
    });
  }));

  it("should exist", function(done) {
    inject(function(OAuthAuthorizationService) {
      expect(OAuthAuthorizationService).be.defined;
      done();
    });
  });
});
