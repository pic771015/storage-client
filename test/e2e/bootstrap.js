"use strict";

var webdriver = require("selenium-webdriver"),
    fs = require("fs"),
    chrome = require("selenium-webdriver/chrome"),
    chromeOptions = new chrome.Options(),
    UNCAUGHT_EXCEPTION = webdriver.promise.ControlFlow.EventType.UNCAUGHT_EXCEPTION,
    LOCAL = process.argv.some(function(el) {return el === "--local";}),
    USER = process.argv.filter(function(el) {
      return el.indexOf("--user") === 0;
    })[0],
    PASSWORD = process.argv.filter(function(el) {
      return el.indexOf("--password") === 0;
    })[0];

if (PASSWORD === undefined) {
  console.log("--password not specified");
  process.exit(1);
}

if (USER === undefined) {
  console.log("--user not specified");
  process.exit(1);
}

PASSWORD = PASSWORD.split("=")[1];
USER = USER.split("=")[1];

chromeOptions.setChromeBinaryPath("/usr/bin/chromium");
chromeOptions.addArguments("web-security=no");

var driver = new webdriver.Builder()
  .forBrowser("chrome")
  .setChromeOptions(chromeOptions)
  .build();

var logAndSnap = function(msg) {
  return function() {
    driver.takeScreenshot().then(function(data) {
      var base64Data = data.replace(/^data:image\/png;base64,/,"");
      fs.writeFile(msg.replace(/ /g, "-") + ".png", base64Data, "base64",
      function(err) {
        if(err) {console.log(err);}
      });
    });
    console.log(msg);
  };
};

driver.controlFlow().addListener(UNCAUGHT_EXCEPTION, function errorHandler(e) {
  logAndSnap("uncaught exception")();
  console.log(e.toString());
  console.log(webdriver.stacktrace.getStack(e));
  driver.quit().then(function() {process.exit(1);});
});

require("./storage-sign-in.js")(driver, LOCAL, USER, PASSWORD);

driver.controlFlow().execute(logAndSnap("done"));
driver.quit();
