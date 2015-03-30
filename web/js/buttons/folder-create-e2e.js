"use strict";
var until = require("selenium-webdriver").until;

module.exports = function(driver) {
  var elementLocators = 
  {
    "newFolder": {"css": "button[ng-click=\"newFolderButtonClick('md')\"]"},
    "dialog": {"css": ".modal-dialog"},
    "newFolderInput": {"id": "newFolderInput"},
    "ok": {"css": "button[ng-click='ok()']"},
    "testFolder": {"css": "a[title='test-folder/']"},
  };

  driver.findElement(elementLocators.newFolder).click();
  driver.wait(until.elementLocated(elementLocators.dialog), 1000, "new folder dialog");

  driver.findElement(elementLocators.newFolderInput).sendKeys("test-folder");
  driver.findElement(elementLocators.ok).click();

  driver.wait(until.elementLocated(elementLocators.testFolder), 5000, "folder found");
};
