"use strict";

module.exports = function(casper, pass, fail) {
  casper.thenClick("#filesTable tbody tr:last-child input");
  casper.thenClick("button[ng-click='deleteButtonClick()']");

  casper.waitUntilVisible(".modal-dialog",
  pass("folder delete dialog shown"),
  fail("folder delete dialog not shown"));

  casper.thenClick("button[ng-click='ok()']");

  casper.waitWhileVisible(".modal-dialog",
  pass("folder delete dialog closed"),
  fail("folder delete dialog not closed"));
  
  casper.waitForResource(/files=--TRASH--%2Ftest-folder/,
  pass("folder deleted"),
  fail("folder not deleted"));

  casper.then(function() {
    casper.test.assertDoesntExist("a[title*='test-folder']");
  });
};
