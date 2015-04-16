/*global process */
"use strict";

var webdriver = require("selenium-webdriver"),
    UNCAUGHT_EXCEPTION = webdriver.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION;

var driver = new webdriver.Builder()
  .forBrowser("phantomjs")
  .build();

var helpers = require("../e2e/bootstrap-helpers.js")(driver);
driver.logMessage = helpers.logMessage;
driver.findAndClickWhenVisible = helpers.findAndClickWhenVisible;
driver.waitForSpinner = helpers.waitForSpinner;

driver.controlFlow().addListener(UNCAUGHT_EXCEPTION, function errorHandler(e) {
  helpers.logAndSnap("uncaught exception")();
  console.log(e.toString());
  console.log(webdriver.stacktrace.getStack(e));
  driver.quit().then(function() {process.exit(1);});
});

var filePaths = 
[
"../../web/js/publicread/public-read-it.js"
];

filePaths.forEach(function(path) {
  helpers.includeTestFile(path);
});

driver.logMessage("done");
driver.quit();
