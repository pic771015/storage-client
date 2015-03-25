"use strict";

module.exports = function(casper, pass, fail) {
  casper.thenClick("a[title='Trash']");

  casper.waitForUrl(/--TRASH/, null, fail("Could not get trash"));

  casper.waitUntilVisible("a[title='test1']", null,
  fail("Trash folder should not be empty"));

  casper.thenClick("#filesTable tbody tr:last-of-type input");

  casper.thenClick("button[ng-click='restoreButtonClick()']");

  casper.waitForResource(/trash.*--TRASH--%2Ftest1/,
  pass("file was restored"),
  fail("file was not restored"));

  casper.thenClick("#filesTable tbody tr a");

  casper.waitUntilVisible("a[title='test1']",
  pass("returned from trash folder"),
  fail("expected file listing on return home"));
};
