"use strict";

module.exports = function(casper, pass, fail) {
  casper.then(function() {
    casper.click("button[ng-click='trashButtonClick()']");
    casper.test.assert(true, "send to trash button clicked");
  });

  casper.waitForResource(/trash\?.*test1/,
  pass("file Trashed"),
  fail("trash failed"));
};
