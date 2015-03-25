"use strict";

module.exports = function(casper, pass, fail) {
  casper.then(function() {
    this.click("button[ng-click=\"newFolderButtonClick('md')\"]");
  });

  casper.waitUntilVisible(".modal-dialog", function() {
    this.sendKeys("#newFolderInput", "test-folder");
    this.click("button[ng-click='ok()']");
  });

  casper.waitWhileVisible(".modal-dialog",
  pass("create folder dialog hidden"), fail("create folder dialog not confirmed"));

  casper.waitForSelector("a[title='test-folder/']",
  pass("folder created"), fail("folder not created"));
};
