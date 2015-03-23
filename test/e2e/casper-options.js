"use strict";

module.exports = function(casper) {
  var currentTimedOutTest = 1;

  casper.options.waitTimeout = 20000;
  casper.options.verbose = true;
  casper.options.logLevel = "info";

  casper.options.onWaitTimeout = function() {
    casper.echo("Timeout - saving timeout-" + currentTimedOutTest + "png", "ERROR");
    casper.capture("timeout-" + currentTimedOutTest + ".png");
    //this.test.fail("Timeout - saved timeout-" + currentTimedOutTest + ".png");
    currentTimedOutTest++;
  };
};
