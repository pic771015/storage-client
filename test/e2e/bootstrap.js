"use strict";

var webdriver = require("selenium-webdriver"),
    fs = require("fs"),
    args = require("./bootstrap-args.js"),
    chrome = require("selenium-webdriver/chrome"),
    chromeOptions = new chrome.Options(),
    UNCAUGHT_EXCEPTION = webdriver.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION;

chromeOptions.setChromeBinaryPath("/usr/bin/chromium");
chromeOptions.addArguments("web-security=no");

var driver = new webdriver.Builder()
  .forBrowser("chrome")
  .setChromeOptions(chromeOptions)
  .build();

var helpers = require("./bootstrap-helpers.js")(driver, fs);

driver.controlFlow().addListener(UNCAUGHT_EXCEPTION, function errorHandler(e) {
  helpers.logAndSnap("uncaught exception")();
  console.log(e.toString());
  console.log(webdriver.stacktrace.getStack(e));
  driver.quit().then(function() {process.exit(1);});
});

require("./storage-sign-in.js")(driver, args.LOCAL, args.USER, args.PASSWORD);
helpers.waitForSpinner();

var filePaths = 
[
"../../web/js/buttons/folder-create-e2e.js"
//"./main-upload-test-file.js",
//"../../web/js/tagging/tagging-file-normal-e2e.js",
//"../../web/js/buttons/file-trash-e2e.js",
//"../../web/js/buttons/file-restore-trash-e2e.js",
//"../../web/js/buttons/folder-move-trash-e2e.js",
//"../../web/js/buttons/folder-delete-e2e.js",
//"../../web/js/modal/modal-e2e.js"
];

filePaths.forEach(function(path) {
  helpers.includeTestFile(path);
});

driver.controlFlow().execute(helpers.logAndSnap("done"));
driver.quit();
