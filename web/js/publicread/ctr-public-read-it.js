"use strict";

describe("PublicReadController", function() {
  function getCompanyIdFromAlteredScope() {
    return evaluate(function() {
      var el = document.querySelector("div[ng-controller='PublicReadController']");
      return angular.element(el).scope().companyId;
    });
  }

  it("should have been instantiated on standalone", function() {
    open("localhost:8000/files/1234");

    var cid = getCompanyIdFromAlteredScope();
    expect(cid).to.equal("1234");
  });

  it("should have been instantiated on modal", function() {
    open("localhost:8000/modal.html#/files/1234");

    var cid = getCompanyIdFromAlteredScope();
    expect(cid).to.equal("1234");
  });
});
