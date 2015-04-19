"use strict";
var until = require("selenium-webdriver").until;

function close() {
  document.querySelector("iframe")
  .contentDocument.querySelector("button[ng-click='closeButtonClick()']")
  .click();
}

function verifyClose() {
  return document.querySelectorAll("iframe").length === 0;
}

function checkClosed(driver) {
  return driver.executeScript(verifyClose)
  .then(function(resp) {
    if (!resp) {return checkClosed(driver);}
  });
}

module.exports = function(driver) {
  driver.get("http://localhost:8000/test/integration/iframe-test.html");
  driver.wait(until.elementLocated({"css": "iframe"}), 2000, "iframe");

  driver.executeScript(close);

  var iframePromise = checkClosed(driver);

  driver.wait(iframePromise , 2000, "iframe");
  driver.logMessage("modal was closed as expected");
};
