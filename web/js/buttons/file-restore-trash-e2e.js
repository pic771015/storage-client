"use strict";

var until = require("selenium-webdriver").until,

locators = {
  "fileCheckbox": {"css": "#filesTable tbody tr:last-child input"},
  "restoreButton": {"css": "button[ng-click='restoreButtonClick()']"},
  "pendingOps": {"css": "div[ng-show='pendingOperations.length > 0']"},
  "previousFolder": {"css": "#filesTable tbody tr a"},
  "fileItem": {"css": "a[title='package.json']"}
};

module.exports = function(driver) {
  var pendingOps = driver.findElement(locators.pendingOps);

  driver.findElement(locators.fileCheckbox).click();
  driver.findElement(locators.restoreButton).click();
  driver.wait(until.elementIsVisible(pendingOps), 9000, "restoring");
  driver.wait(until.elementIsNotVisible(pendingOps), 9000, "restored");
  driver.findElement(locators.previousFolder).click();
  driver.wait(until.elementLocated(locators.fileItem), 9000, "found in main");
};
