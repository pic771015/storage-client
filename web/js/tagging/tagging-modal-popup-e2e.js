"use strict";
var until = require("selenium-webdriver").until,

locators = {
  "fileCheckbox": {"css": "#filesTable tbody tr:first-child input"},
  "taggingButton": {"css": "button[ng-click='taggingButtonClick()']"},
  "taggingModal": {"css": ".modal-dialog"},
  "taggingModalCancel": {"css": "button[ng-click='cancel()']"},
  "modalDialog": {"css": "div.modal-dialog"},
  "editLookup": {"css": "div[ng-click='editLookup()']"},
  "editFreeform": {"css": "div[ng-click='editFreeform()']"},
  "tagTypeEditingModal": {"css": "div[ng-show='!showMainTagView']"},
  "editTimeline": {"css": "div[ng-click='editTimeline()']"},
  "clearAllTimelineTags": {"css": "button[ng-click='clearAllTimelineTags()']"},
  "selectedTagdef1Value1": {"css": "#selectedLookupTags div[title='tagdef1: value1']"},
  "availableTagdef1Value1": {"css": "#availableLookupTags div[title='tagdef1: value1']"},
  "freeformPlaceholder": {"css": "input[placeholder='Enter freeform1']"},
  "saveButton": {"css": "button[ng-click='saveChangesFromView()']"},
  "cancelButton": {"css": "button[ng-click='resetView()']"}
};

module.exports = function(driver) {
  var taggingModal;

  // Select first available file
  driver.findElement(locators.fileCheckbox).click();

  // Display tagging modal
  driver.findElement(locators.taggingButton).click();
  driver.wait(until.elementLocated(locators.taggingModal), 2000, "modal open");

  taggingModal = driver.findElement(locators.taggingModal);

  // Wait for cancel button as a confirmation that the modal has been displayed
  driver.wait(until.elementIsVisible(driver.findElement(locators.taggingModalCancel)), 1000, "modal cancel button");

  // Display edit lookup section to add a tag
  driver.findAndClickWhenVisible(locators.editLookup);

  driver.wait(until.elementIsVisible(driver.findElement(locators.tagTypeEditingModal)), 7000, "wait until lookup tag window is loaded");

  driver.findElements(locators.selectedTagdef1Value1).then(function(tags) {
    if(tags.length === 0) {
      driver.wait(until.elementLocated(locators.availableTagdef1Value1), 2000, "lookup tag available");
      
      driver.sleep(500);
      driver.findAndClickWhenVisible(locators.availableTagdef1Value1);
      driver.wait(until.elementLocated(locators.selectedTagdef1Value1), 2000, "lookup tag added");

      driver.sleep(500);
      driver.findAndClickWhenVisible(locators.saveButton);
      driver.wait(until.elementIsNotVisible(driver.findElement(locators.tagTypeEditingModal)), 7000, "wait until lookup tag window is closed");
    }
  });

  driver.logMessage("Section 2");
  // Display edit lookup section to remove a tag
  driver.findAndClickWhenVisible(locators.editLookup);

  driver.wait(until.elementIsVisible(driver.findElement(locators.tagTypeEditingModal)), 7000, "wait until lookup tag window is loaded");

  driver.findElements(locators.selectedTagdef1Value1).then(function(tags) {
    if(tags.length === 1) {
      driver.findAndClickWhenVisible(locators.selectedTagdef1Value1);
      driver.findAndClickWhenVisible(locators.saveButton);
      driver.wait(until.elementIsNotVisible(driver.findElement(locators.tagTypeEditingModal)), 7000, "wait until lookup tag window is closed");
    } else {
      driver.findAndClickWhenVisible(locators.cancelButton);
    }
  });

  // Display edit freeform section to add a freeform tag
  driver.logMessage("Section 3");
  driver.findAndClickWhenVisible(locators.editFreeform);
  driver.wait(until.elementIsVisible(driver.findElement(locators.tagTypeEditingModal)), 7000, "wait until freeform tag window is loaded");


  driver.findElements(locators.freeformPlaceholder).then(function(tags) {
    if(tags.length === 1) {
      driver.sleep(500);
      driver.findElement(locators.freeformPlaceholder).clear();
      driver.findElement(locators.freeformPlaceholder).sendKeys("new value");

      driver.sleep(500);
      driver.findAndClickWhenVisible(locators.saveButton);
      driver.wait(until.elementIsNotVisible(driver.findElement(locators.tagTypeEditingModal)), 7000, "wait until freeform tag window is closed");
    } else {
      driver.findAndClickWhenVisible(locators.cancelButton);
    }
  });

  driver.logMessage("Section 4");
  // Display edit timeline section
  driver.findAndClickWhenVisible(locators.editTimeline);

  driver.wait(until.elementIsVisible(driver.findElement(locators.tagTypeEditingModal)), 7000, "wait until timeline window is loaded");

  driver.findAndClickWhenVisible(locators.saveButton);

  driver.wait(until.elementLocated({"xpath": "//*[text()='60 Seconds']"}), 2000, "wait until '60 Seconds' message is found");

  // Clear timeline tags
  driver.findAndClickWhenVisible(locators.clearAllTimelineTags);
  
  driver.wait(until.elementLocated({"xpath": "//*[text()='Add Timeline']"}), 2000, "wait until 'Add Timeline' message is found");

  // Close the window clicking Cancel
  driver.findAndClickWhenVisible(locators.taggingModalCancel);

  // Confirm the modal has been closed
  driver.wait(until.stalenessOf(taggingModal), 5000, "modal cancel");
  driver.sleep(1000);
};
