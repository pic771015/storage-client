"use strict";

var until = require("selenium-webdriver").until,

locators = {
  "folderCheckbox": {"css": "#filesTable tbody tr:nth-child(2) input"},
  "trashButton": {"css": "button[ng-click='trashButtonClick()']"},
  "pendingOps": {"css": "div[ng-show='pendingOperations.length > 0']"},
  "trashFolder": {"css": "a[title='Trash'"},
  "folderItem": {"css": "a[title='test-folder/']"}
};

module.exports = function(driver) {
  var pendingOps = driver.findElement(locators.pendingOps);

  driver.findElement(locators.folderCheckbox).click();
  driver.findElement(locators.trashButton).click();
  driver.wait(until.elementIsVisible(pendingOps), 18000, "trashing folder");
  driver.wait(until.elementIsNotVisible(pendingOps), 17000, "folder trashed");
  driver.findElement(locators.trashFolder).click();
  driver.wait(until.elementLocated(locators.folderItem), 5000, "folder in trash");
};
