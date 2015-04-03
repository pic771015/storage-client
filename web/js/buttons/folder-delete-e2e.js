"use strict";

var until = require("selenium-webdriver").until,

locators = {
  "folderCheckbox": {"css": "#filesTable tbody tr:last-child input"},
  "deleteButton": {"css": "button[ng-click='deleteButtonClick()']"},
  "confirmButton": {"css": "span[translate='common.delete-forever'"},
  "pendingOps": {"css": "div[ng-show='pendingOperations.length > 0']"},
  "folderItem": {"css": "a[title='test-folder/']"}
};

module.exports = function(driver) {
  var pendingOps = driver.findElement(locators.pendingOps);

  driver.findAndClickWhenVisible(locators.folderCheckbox);
  driver.findAndClickWhenVisible(locators.deleteButton);
  driver.findAndClickWhenVisible(locators.confirmButton);

  driver.wait(until.elementIsVisible(pendingOps), 9000, "deleting");
  driver.wait(until.elementIsNotVisible(pendingOps), 9000, "deleted");

  driver.wait(driver.executeScript
  ("return document.querySelectorAll(\"a[title='test-folder/']\").length === 0"),
  9000, "item removed from listing");
};
