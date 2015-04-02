"use strict";

var until = require("selenium-webdriver").until,

locators = {
  tagConfiguration: { css: "a[ng-href*='displayTagConfigurationMain()']" },
  storageMain: { css: "a[ng-href*='displayStorageMain()']" },
  storageHeader: { css: "h1[translate='storage-client.header']" },
  addTagsButton: { css: "button[ng-click='addTags()']" },
  tagdef1: { css: "div[title='tagdef1']" },
  tagdef2: { css: "div[title='tagdef2']" },
  freeform1: { css: "div[title='freeform1']" }
};

module.exports = function(driver) {
  driver.findElement(locators.tagConfiguration).click();
  driver.wait(until.elementLocated(locators.addTagsButton), 5000, "add tag button");

  // Create a tag definition
  driver.findElements(locators.tagdef1).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagName = { css: "#editTagSettings input[ng-model='selectedTag.name']" };
    var selectedTagValues = { css: "#editTagSettings input[ng-model='selectedTag.values']" };

    if(tagdefs.length === 0) {
      driver.sleep(500);
      driver.findElement(locators.addTagsButton).click();
      
      driver.findElement(selectedTagName).sendKeys("tagdef1");
      driver.findElement(selectedTagValues).sendKeys("value1,value2,value3");

      driver.sleep(500);
      driver.findElement(updateOrAddTag).click();

      driver.wait(until.elementIsNotVisible(driver.findElement(updateOrAddTag)), 5000, "tag definition added");
      driver.wait(until.elementLocated(locators.tagdef1), 5000, "tag list definition refreshed");
    }
  });

  // Create another tag definition
  driver.findElements(locators.tagdef2).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagName = { css: "#editTagSettings input[ng-model='selectedTag.name']" };
    var selectedTagValues = { css: "#editTagSettings input[ng-model='selectedTag.values']" };

    if(tagdefs.length === 0) {
      driver.sleep(500);
      driver.findElement(locators.addTagsButton).click();
      
      driver.findElement(selectedTagName).sendKeys("tagdef2");
      driver.findElement(selectedTagValues).sendKeys("valuea,valueb,valuec");

      driver.sleep(500);
      driver.findElement(updateOrAddTag).click();

      driver.wait(until.elementIsNotVisible(driver.findElement(updateOrAddTag)), 5000, "tag definition added");
      driver.wait(until.elementLocated(locators.tagdef2), 5000, "tag definition list refreshed");
    }
  });

  // Update the latest tag definition
  driver.findElements(locators.tagdef2).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagValues = { css: "#editTagSettings input[ng-model='selectedTag.values']" };

    if(tagdefs.length === 1) {
      driver.sleep(500);
      driver.findElement(locators.tagdef2).click();

      driver.wait(until.elementLocated(selectedTagValues), 5000, "tag definition clicked");

      driver.findElement(selectedTagValues).getAttribute("value").then(function(value) {
        value = value.indexOf("valued") === -1 ? "valuea,valueb,valuec,valued" : "valuea,valueb,valuec";

        driver.findElement(selectedTagValues).clear();
        driver.findElement(selectedTagValues).sendKeys(value);

        driver.sleep(500);
        driver.findElement(updateOrAddTag).click();

        driver.wait(until.elementIsNotVisible(driver.findElement(updateOrAddTag)), 5000, "tag definition updated");
        driver.wait(until.elementLocated(locators.tagdef2), 5000, "tag definition list refreshed");
      });
    }
  });

  // Delete the latest tag definition
  driver.findElements(locators.tagdef2).then(function(tagdefs) {
    var openConfirm = { css: "#editTagSettings button[ng-click='openConfirm()']" };
    var okButton = { css: "#taggingDeleteForm button[ng-click='ok()']" };

    if(tagdefs.length === 1) {
      driver.sleep(500);
      driver.findElement(locators.tagdef2).click();

      driver.wait(until.elementLocated(openConfirm), 5000, "tag definition clicked");
      driver.findElement(openConfirm).click();

      driver.wait(until.elementLocated(okButton), 5000, "tag definition clicked");
      driver.findElement(okButton).click();

      driver.wait(until.elementLocated(locators.tagdef1), 5000, "tag definition refreshed");
      driver.wait(until.stalenessOf(tagdefs[0]), 5000, "tag definition deleted");
    }
  });

  // Create a freeform tag definition
  driver.findElements(locators.freeform1).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagName = { css: "#editTagSettings input[ng-model='selectedTag.name']" };
    var changeTagType = { css: "#editTagSettings input[ng-click='changeTagType()']" };

    if(tagdefs.length === 0) {
      driver.sleep(500);
      driver.findElement(locators.addTagsButton).click();
      
      driver.findElement(selectedTagName).sendKeys("freeform1");
      driver.findElement(changeTagType).click();

      driver.sleep(500);
      driver.findElement(updateOrAddTag).click();

      driver.wait(until.elementIsNotVisible(driver.findElement(updateOrAddTag)), 5000, "tag definition added");
      driver.wait(until.elementLocated(locators.freeform1), 5000, "tag definition list refreshed");
    }
  });

  driver.findElement(locators.storageMain).click();
  driver.wait(until.elementLocated(locators.storageHeader), 5000, "storage header");
};
