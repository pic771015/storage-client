"use strict";
var until = require("selenium-webdriver").until,
webdriver = require("selenium-webdriver"),
flow = webdriver.promise.controlFlow(),

locators = {
  "fileCheckbox": {"css": "#filesTable tbody tr:first-child input"},
  "taggingButton": {"css": "button[ng-click='taggingButtonClick()']"},
  "taggingModal": {"css": ".modal-dialog"},
  "taggingModalCancel": {"css": "button[ng-click='cancel()']"},
  "modalDialog": {"css": "div.modal-dialog"},
  "editLookup": {"css": "div[ng-click='editLookup()']"},
  "editFreeform": {"css": "div[ng-click='editFreeform()']"},
  "editTimeline": {"css": "div[ng-click='editTimeline()']"},
  "clearAllTimelineTags": {"css": "button[ng-click='clearAllTimelineTags()']"},
  "selectedTagdef1Value1": {"css": "#selectedLookupTags div[title='tagdef1: value1']"},
  "availableTagdef1Value1": {"css": "#availableLookupTags div[title='tagdef1: value1']"},
  "freeformPlaceholder": {"css": "input[placeholder='Enter freeform1']"},
  "saveButton": {"css": "button[ng-click='saveChangesFromView()']"}
};

function logSync(message) {
  flow.execute(function() {
    console.log(message);
  });
}

module.exports = function(driver) {
  var taggingModal;

  logSync("Begin tagging modal popup");

  // Select first available file
  driver.findElement(locators.fileCheckbox).click();

  // Display tagging modal
  driver.findElement(locators.taggingButton).click();
  driver.wait(until.elementLocated(locators.taggingModal), 2000, "modal open");

  taggingModal = driver.findElement(locators.taggingModal);

  // Wait for cancel button as a confirmation that the modal has been displayed
  driver.wait(until.elementIsVisible(driver.findElement(locators.taggingModalCancel)), 1000, "modal cancel button");

  // Display edit lookup section to add a tag
  driver.findElement(locators.editLookup).click();

  driver.wait(until.elementLocated({"css": "#selectedLookupTags"}), 2000, "wait until lookup window is loaded");

  driver.findElements(locators.selectedTagdef1Value1).then(function(tags) {
    if(tags.length === 0) {
      driver.wait(until.elementLocated(locators.availableTagdef1Value1), 2000, "lookup tag available");
      
      driver.sleep(500);
      driver.findElement(locators.availableTagdef1Value1).click();
      driver.wait(until.elementLocated(locators.selectedTagdef1Value1), 2000, "lookup tag added");

      driver.sleep(500);
      driver.findElement(locators.saveButton).click();
      driver.wait(until.elementLocated(locators.editLookup), 2000, "edit lookup visible");
    }
  });

  // Display edit lookup section to remove a tag
  driver.sleep(2000);
  driver.findElement(locators.editLookup).click();

  driver.wait(until.elementLocated({"css": "#selectedLookupTags"}), 2000, "wait until lookup window is loaded");

  driver.findElements(locators.selectedTagdef1Value1).then(function(tags) {
    if(tags.length === 1) {
      driver.sleep(500);
      driver.findElement(locators.selectedTagdef1Value1).click();
      driver.wait(until.elementLocated(locators.availableTagdef1Value1), 2000, "lookup tag removed");

      driver.sleep(500);
      driver.findElement(locators.saveButton).click();
      driver.wait(until.elementLocated(locators.editLookup), 2000, "edit lookup visible");
    }
  });

  // Display edit freeform section to add a freeform tag
  driver.sleep(2000);
  driver.findElement(locators.editFreeform).click();

  driver.wait(until.elementLocated({"css": "#remove-all-freeform-tags-edit"}), 2000, "wait until freeform window is loaded");

  driver.findElements(locators.freeformPlaceholder).then(function(tags) {
    if(tags.length === 1) {
      driver.sleep(500);
      driver.findElement(locators.freeformPlaceholder).clear();
      driver.findElement(locators.freeformPlaceholder).sendKeys("new value");

      driver.sleep(500);
      driver.findElement(locators.saveButton).click();
      driver.wait(until.elementLocated(locators.editFreeform), 2000, "edit freeform visible");
    }
  });

  // Display edit timeline section
  driver.sleep(2000);
  driver.findElement(locators.editTimeline).click();

  driver.wait(until.elementLocated({"css": ".timeline"}), 2000, "wait until timeline window is loaded");

  driver.sleep(500);
  driver.findElement(locators.saveButton).click();

  driver.wait(until.elementLocated({"xpath": "//*[text()='60 Seconds']"}), 2000, "wait until '60 Seconds' message is found");

  // Clear timeline tags
  driver.sleep(2000);
  driver.findElement(locators.clearAllTimelineTags).click();
  
  driver.wait(until.elementLocated({"xpath": "//*[text()='Add Timeline']"}), 2000, "wait until 'Add Timeline' message is found");

  // Close the window clicking Cancel
  driver.sleep(1000);
  driver.findElement(locators.taggingModalCancel).click();

  // Confirm the modal has been closed
  driver.wait(until.stalenessOf(taggingModal), 5000, "modal cancel");
  driver.sleep(1000);
};
