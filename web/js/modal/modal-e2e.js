"use strict";

var until = require("selenium-webdriver").until,
webdriver = require("selenium-webdriver"),

rvaPresentationUrl = "http://rva.risevision.com/#PRESENTATIONS/company=a6397169-ad53-4163-9e08-da3e53f3a413",
expectedUrlFromStorageModal = "https://storage.googleapis.com/risemedialibrary-a6397169-ad53-4163-9e08-da3e53f3a413/package.json",

locators = {
  "addPlaceholder": {"css": "div[title='Add Placeholder']"},
  "addPresentation": {"xpath": "//span[text()='Add']"},
  "add": {"xpath": "//a[text()='Add']"},
  "image": {"xpath": "//td[text()='Image']"},
  "storage": {"xpath": "//div[@class='popupContent']//a/span[text()='Storage']"},
  "spinner": {"css": "div.spinner-backdrop"},
  "returnedUrl": {"xpath": "//input[@value='" + expectedUrlFromStorageModal + "']"}
};

module.exports = function(driver) {
  driver.get(rvaPresentationUrl);
  driver.wait(until.elementLocated(locators.addPresentation), 15000, "rva open");
  driver.waitForSpinner("add presentation");
  driver.findElement(locators.addPresentation).click();

  driver.wait(until.elementLocated(locators.addPlaceholder), 15000, "placeholder");
  driver.findElement(locators.addPlaceholder).click();

  driver.wait(until.elementLocated(locators.add), 1000, "add");
  driver.sleep(500);
  driver.findElement(locators.add).click();
  driver.wait(until.elementLocated(locators.image), 1000, "image");
  driver.sleep(500);
  driver.findElement(locators.image).click();
  driver.wait(until.elementLocated(locators.storage), 1000, "storage");
  driver.sleep(500);
  driver.findElement(locators.storage).click();

  driver.wait(function waitForStorage() {
    return driver.executeScript(function findAndClickFile() {
      return checkDocFramesForFile(document);

      function checkDocFramesForFile(doc) {
        var frames = doc.querySelectorAll("iframe");
        var fileLink = doc.querySelector("a[title='package.json']");

        if (fileLink) {
          fileLink.click();
          return true;
        } else {
          return Array.prototype.some.call(frames, function(frame){
            var doc = frame.contentDocument;
            if (doc) {return checkDocFramesForFile(doc);}
            return false;
          });
        }
      }
    });
  }, 9000, "storage modal");

  driver.wait(function waitForUrlFromStorage() {
    return driver.executeScript(function findUrl() {
      var textBoxElements = document.querySelectorAll("input.rdn-TextBoxLong"),
      expectedUrl = arguments[arguments.length - 1];

      return Array.prototype.some.call(textBoxElements, function(el) {
        return el.value === expectedUrl;
      });
    }, expectedUrlFromStorageModal);
  }, 9000, "storage url");
};
