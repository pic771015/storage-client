"use strict";

var until = require("selenium-webdriver").until,

locators = {
  "trashButton": {"css": "button[ng-click='trashButtonClick()']"},
  "pendingOps": {"css": "div[ng-show='pendingOperations.length > 0']"},
  "trashRow": {"css": "a[title='Trash']"},
  "fileItem": {"css": "a[title='package.json']"}
};

module.exports = function(driver) {
  var pendingOps = driver.findElement(locators.pendingOps);

  driver.findElement(locators.trashButton).click();
  driver.wait(until.elementIsVisible(pendingOps), 9000, "trashing");
  driver.wait(until.elementIsNotVisible(pendingOps), 9000, "trashed");
  driver.findElement(locators.trashRow).click();
  driver.wait(until.elementLocated(locators.fileItem), 9000, "found in trash");
};
