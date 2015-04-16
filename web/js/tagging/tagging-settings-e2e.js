"use strict";

var until = require("selenium-webdriver").until,

locators = {
  offCanvas: {css: "a[class*='navbar-brand'][off-canvas-toggle]"},
  tagConfiguration: { css: "a[ng-href*='displayTagConfigurationMain()']" },
  storageMain: { css: "a[ng-href*='displayStorageMain()']" },
  addTagsButton: { css: "button[ng-click='addTags()']" },
  tagdef1: { css: "div[title='tagdef1']" },
  tagdef2: { css: "div[title='tagdef2']" },
  freeform1: { css: "div[title='freeform1']" },
  fileListItem: { css: "a[title='package.json']" },
  addTagMenu: { css: "#editTagSettings" }
};

function showOffCanvasMenuIfSmallScreen(driver) {
  driver.call(function() {
    driver.wait(until.elementLocated(locators.offCanvas), 1000, "off-canvas")
    .then(function() {
      driver.findElement(locators.offCanvas).click();
    }).then(null, function(){
      console.log("small screen off-canvas toggle not located");
    });
  });
}

module.exports = function(driver) {
  var fileListItem;
  showOffCanvasMenuIfSmallScreen(driver);
  driver.findAndClickWhenVisible(locators.tagConfiguration);
  driver.wait(until.elementLocated(locators.addTagsButton), 5000, "add tag button");

  // Create a tag definition
  driver.logMessage("Section 1");
  driver.findElements(locators.tagdef1).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagName = { css: "#editTagSettings input[ng-model='selectedTag.name']" };
    var selectedTagValues = { css: "#editTagSettings input[ng-model='selectedTag.values']" };

    if(tagdefs.length === 0) {
      driver.findAndClickWhenVisible(locators.addTagsButton);
      driver.wait(until.elementIsVisible(driver.findElement(locators.addTagMenu)), 4000, "add tag menu");
      
      driver.findElement(selectedTagName).sendKeys("tagdef1");
      driver.findElement(selectedTagValues).sendKeys("value1,value2,value3");

      driver.findAndClickWhenVisible(updateOrAddTag);

      driver.wait(until.elementIsNotVisible(driver.findElement(locators.addTagMenu)), 4000, "add tag menu");
      driver.wait(until.elementLocated(locators.tagdef1), 5000, "tag list definition refreshed");
    }
  });

  // Create another tag definition
  driver.logMessage("Section 2");
  driver.findElements(locators.tagdef2).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagName = { css: "#editTagSettings input[ng-model='selectedTag.name']" };
    var selectedTagValues = { css: "#editTagSettings input[ng-model='selectedTag.values']" };

    if(tagdefs.length === 0) {
      driver.findAndClickWhenVisible(locators.addTagsButton);
      driver.wait(until.elementIsVisible(driver.findElement(locators.addTagMenu)), 9000, "add tag menu");
      driver.logMessage("adding tag");

      driver.findElement(selectedTagName).sendKeys("tagdef2");
      driver.findElement(selectedTagValues).sendKeys("valuea,valueb,valuec");
      driver.logMessage("added tagdef2");

      driver.findAndClickWhenVisible(updateOrAddTag);

      driver.wait(until.elementIsNotVisible(driver.findElement(locators.addTagMenu)), 9000, "add tag menu");
      driver.wait(until.elementLocated(locators.tagdef2), 15000, "tag definition list refreshed");
    }
  });

  // Update the latest tag definition
  driver.logMessage("Section 3");
  driver.findElements(locators.tagdef2).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagValues = { css: "#editTagSettings input[ng-model='selectedTag.values']" };

    if(tagdefs.length === 1) {
      driver.findAndClickWhenVisible(locators.tagdef2);

      driver.wait(until.elementIsVisible(driver.findElement(locators.addTagMenu)), 5000, "tag definition clicked");
      driver.logMessage("addTagMenu is visible");

      driver.findElement(selectedTagValues).getAttribute("value").then(function(value) {
        value = value.indexOf("valued") === -1 ? "valuea,valueb,valuec,valued" : "valuea,valueb,valuec";

        driver.findElement(selectedTagValues).clear();
        driver.findElement(selectedTagValues).sendKeys(value);

        driver.findAndClickWhenVisible(updateOrAddTag);

        driver.wait(until.elementIsNotVisible(driver.findElement(locators.addTagMenu)), 9000, "add tag menu");
        driver.wait(until.elementLocated(locators.tagdef2), 5000, "tag definition list refreshed");
      });
    }
  });

  // Delete the latest tag definition
  driver.logMessage("Section 4");
  driver.findElements(locators.tagdef2).then(function(tagdefs) {
    var openConfirm = { css: "#editTagSettings button[ng-click='openConfirm()']" };
    var okButton = { css: "#taggingDeleteForm button[ng-click='ok()']" };

    if(tagdefs.length === 1) {
      driver.findAndClickWhenVisible(locators.tagdef2);

      driver.findAndClickWhenVisible(openConfirm);

      driver.findAndClickWhenVisible(okButton);

      driver.wait(until.elementIsNotVisible(driver.findElement(locators.addTagMenu)), 19000, "add tag menu");
      driver.wait(until.stalenessOf(tagdefs[0]), 7000, "tag definition deleted");
    }
  });

  // Create a freeform tag definition
  driver.logMessage("Section 5");
  driver.findElements(locators.freeform1).then(function(tagdefs) {
    var updateOrAddTag = { css: "#editTagSettings button[ng-click='updateOrAddTag()']" };
    var selectedTagName = { css: "#editTagSettings input[ng-model='selectedTag.name']" };
    var changeTagType = { css: "#editTagSettings input[ng-click='changeTagType()']" };

    if(tagdefs.length === 0) {
      driver.findAndClickWhenVisible(locators.addTagsButton);
      
      driver.findElement(selectedTagName).sendKeys("freeform1");
      driver.findAndClickWhenVisible(changeTagType);

      driver.findAndClickWhenVisible(updateOrAddTag);

      driver.wait(until.elementIsNotVisible(driver.findElement(locators.addTagMenu)), 9000, "add tag menu");
      driver.wait(until.elementLocated(locators.freeform1), 5000, "tag definition list refreshed");
    }
  });

  driver.logMessage("Section 6");
  showOffCanvasMenuIfSmallScreen(driver);
  driver.findAndClickWhenVisible(locators.storageMain);
  driver.wait(until.elementLocated(locators.fileListItem), 12000, "file listing");
  fileListItem = driver.findElement(locators.fileListItem);
  driver.wait(until.elementIsVisible(fileListItem), 5000, "file item");
};
