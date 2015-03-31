/* global process */
"use strict";
var until = require("selenium-webdriver").until,
openFileSync = require("fs").openSync,

uploadFilePath = process.cwd() + "/package.json",
HOME = process.env.HOME,
downloadFilePath = HOME + "/e2e-downloads/storage-client/package.json",

locators = {
  "fileInputElement": {"id": "file"},
  "fileRow": {"css": "a[title='package.json']"},
  "fileCheckbox": {"css": "#filesTable tbody tr:first-child input"},
  "downloadButton": {"css": "i.fa-cloud-download"}
};

module.exports = function(driver) {
  driver.logMessage("locating file input element");
  driver.findElement(locators.fileInputElement).sendKeys(uploadFilePath);
  driver.wait(until.elementLocated(locators.fileRow), 9000, "file upload");

  driver.findElement(locators.fileCheckbox).click();
  driver.findElement(locators.downloadButton).click();
  driver.wait(function fileDownloadCheck() {
    try {
      openFileSync(downloadFilePath, "r");
    } catch (e) {
      return false;
    }
    return true;
  }, 15000, "file download");
};
