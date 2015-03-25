"use strict";

module.exports = function(casper) {
  casper.then(function() {
    casper.click("#filesTable tbody tr:nth-of-type(2n) input");
    casper.test.assertVisible("button[title='Tagging']", "visible tag icon");
  });

  casper.then(function() {
    this.click("button[ng-click='taggingButtonClick()']");
  });

  casper.waitUntilVisible(".modal-dialog", function() {
    casper.test.assert(true, "tagging modal displayed");
    this.click("button[ng-click='cancel()']");
  });

  casper.waitWhileVisible(".modal-dialog", function() {
    casper.test.assert(true, "tagging dialog hidden");
  });
};
