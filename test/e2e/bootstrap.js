/*global process */
"use strict";

var fs = require("fs");
var isWindows = /^win/.test(process.platform);
var webdriver = require("selenium-webdriver"),
    args = require("./bootstrap-args.js"),
    chrome = require("selenium-webdriver/chrome"),
    chromeOptions = new chrome.Options(),
    UNCAUGHT_EXCEPTION = webdriver.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION;

if(isWindows) {
  var x86Path = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  var x64Path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  if(fs.existsSync(x86Path)) {
    chromeOptions.setChromeBinaryPath(x86Path);
  }
  else {
    chromeOptions.setChromeBinaryPath(x64Path);
  }
}
else {
  chromeOptions.setChromeBinaryPath("/usr/bin/chromium");
}
chromeOptions.addArguments("--disable-web-security");
chromeOptions.setUserPreferences(
{"download": 
  {"default_directory": process.env.HOME + "/e2e-downloads/storage-client",
   "type": 1,
   "prompt_for_download": false}
});

var driver = new webdriver.Builder()
  .forBrowser("chrome")
  .setChromeOptions(chromeOptions)
  .build();

var helpers = require("./bootstrap-helpers.js")(driver);
driver.waitForObstructions = helpers.waitForObstructions;
driver.logMessage = helpers.logMessage;
driver.findAndClickWhenVisible = helpers.findAndClickWhenVisible;

driver.controlFlow().addListener(UNCAUGHT_EXCEPTION, function errorHandler(e) {
  helpers.logAndSnap("uncaught exception")();
  console.log(e.toString());
  console.log(webdriver.stacktrace.getStack(e));
  driver.quit().then(function() {process.exit(1);});
});

require("./storage-sign-in.js")(driver, args.LOCALCLIENT, args.LOCALSERVER, args.USER, args.PASSWORD);
helpers.waitForObstructions();

var filePaths = 
[
"../../web/js/publicread/public-read-it.js",
"../../web/js/subscription/subscription-e2e.js",
"../../web/js/buttons/folder-create-e2e.js",
"./upload-download.js",
"../../web/js/tagging/tagging-settings-e2e.js",
"../../web/js/tagging/tagging-modal-popup-e2e.js",
"../../web/js/buttons/file-trash-e2e.js",
"../../web/js/buttons/file-restore-trash-e2e.js",
"../../web/js/buttons/folder-move-trash-e2e.js",
"../../web/js/buttons/folder-delete-e2e.js",
"../../web/js/modal/modal-e2e.js"
];

filePaths.forEach(function(path) {
  helpers.includeTestFile(path);
});

driver.controlFlow().execute(helpers.logAndSnap("done"));
driver.quit();
