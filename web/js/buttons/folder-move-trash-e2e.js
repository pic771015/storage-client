"use strict";

module.exports = function(casper) {
  casper.thenClick("#filesTable tbody tr:first-of-type input");
  casper.thenClick("button[title='Move To Trash']");

  casper.waitForResource(/trash.*files=test-folder%2F/);

  casper.thenClick("a[title='Trash']");

  casper.waitForUrl(/--TRASH/);
  casper.waitForSelector("a[title='test-folder/']");
};
