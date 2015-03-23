"use strict";

module.exports = function(casper) {
  // Clicks the Delete button, to permanently delete the folder
  casper.then(function() {
    this.click("button[ng-click=\"deleteButtonClick()\"]");
    casper.test.assert(true, "delete button clicked");
  });

  // Waits for the popup to show and confirms the action
  casper.waitUntilVisible(".modal-dialog", function() {
    casper.test.assert(true, "confirm permanent deletion dialog displayed");

    this.click("button[ng-click='ok()']");
  });

  // Waits for the popup to disappear
  casper.waitWhileVisible(".modal-dialog", function() {
    casper.test.assert(true, "confirm permanent deletion dialog hidden");
  });

  // Waits for the deleting info message to show
  casper.waitUntilVisible(".panel-info", function() {
    casper.test.assert(true, "files are being deleted");
  });

  // Waits for the deleting info message to hide
  casper.waitWhileVisible(".panel-info", function() {
    casper.test.assert(true, "files successfully deleted");
  });

  // Checks the delete folder does not show in the file listing anymore
  casper.then(function() {
    casper.test.assertDoesntExist("a[title*='test-folder']");
  });
};
