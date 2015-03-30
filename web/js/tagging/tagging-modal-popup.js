"use strict";
var until = require("selenium-webdriver").until,

locators = {
  "fileCheckbox": {"css": "#filesTable tbody tr:first-child input"},
  "taggingButton": {"css": "button[ng-click='taggingButtonClick()']"},
  "taggingModal": {"css": ".modal-dialog"},
  "taggingModalCancel": {"css": "button[ng-click='cancel()']"},
  "modalDialog": {"css": "div.modal-dialog"}
};

module.exports = function(driver) {
  driver.findElement(locators.taggingButton).click();

  driver.wait(until.elementLocated(locators.taggingModal), 2000, "modal open");

  driver.wait
  (until.elementIsVisible
  (driver.findElement(locators.taggingModalCancel)), 1000, "modal cancel button");

  driver.sleep(1000);
  driver.findElement(locators.taggingModalCancel).click();

  driver.wait
  (until.elementIsNotVisible
  (driver.findElement(locators.taggingModal)), 5000, "modal cancel");

  driver.sleep(1000);
};
