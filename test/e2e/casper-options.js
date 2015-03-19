"use strict";

module.exports = function(casper) {
  var currentTimedOutTest = 1, resourceError = 1;

  casper.options.waitTimeout = 15000;
  casper.options.verbose = true;
  casper.options.logLevel = "info";
  if (casper.cli.has("nocolor")) {
    casper.options.colorizerType = "Dummy";
  }

  casper.on("remote.message", function(msg) {
    casper.echo("DOM console: " + msg);
  });

  casper.on("page.error", function(msg, trace) {
    casper.echo("DOM Error: " + msg + "\n" + trace, "ERROR");
  });

  casper.on("error", function(msg, trace) {
    casper.echo("Error: " + msg + "\n" + trace, "ERROR");
  });

  casper.on("resource.error", function(error) {
    casper.echo("Resource error: " + JSON.stringify(error));
    casper.capture("e2e-log/resource-error-" + resourceError + ".png");
    resourceError += 1;
  });

  casper.options.onWaitTimeout = function() {
    casper.echo("Timeout - saving timeout-" + currentTimedOutTest + ".png", "ERROR");
    casper.capture("e2e-log/timeout-" + currentTimedOutTest + ".png");
    casper.test.fail("timeout reached");
    currentTimedOutTest++;
  };
};
