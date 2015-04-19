"use strict";
var until = require("selenium-webdriver").until;

function closeStorageModal() {
  document.querySelector("iframe")
  .contentDocument.querySelector("button[ng-click='closeButtonClick()']")
  .click();
}

function isModalOpened() {
  return document.querySelector("iframe")
  .contentDocument.querySelector("button[ng-click='closeButtonClick()']")
}

function isModalClosed() {
  return document.querySelectorAll("iframe").length === 0;
}

module.exports = function(driver) {
  driver.get("http://localhost:8000/test/integration/iframe-test.html");
  driver.waitForTruthyScript(isModalOpened, 5000, "modal opened");

  driver.executeScript(closeStorageModal);

  driver.waitForTruthyScript(isModalClosed, 5000, "modal not closed");

  driver.logMessage("modal was closed as expected");
};
