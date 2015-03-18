"use strict";

module.exports = function(casper) {
  var foundFile = false;
  
  // Marks the first file if found as selected
  casper.then(function() {
    foundFile = this.evaluate(function() {
      var trs = document.querySelectorAll("#filesTable tbody tr");

      for(var i = 0; i < trs.length; i++) {
        if(trs[i].children[1].children[0].children[0].classList.contains("fa-file")) {
          trs[i].children[0].children[0].click();
          return true;
        }
      }
      return false;
    });

    if(foundFile){
      // Test that tagging buttons are visible on file Select
      casper.echo("Checking tagging buttons visible on selected files.");
      casper.test.assertVisible("a[title='Tag File']");
      casper.test.assertVisible("button[title='Tagging']");
      casper.echo("file found and tag icons and buttons visible.");

      // Clicks the Tagging Button, test if Modal becomes visible for file
      casper.then(function() {
        this.click("button[ng-click='taggingButtonClick()']");
        casper.test.assert(true, "tagging button clicked for file");
      });
      // Waits for the popup to show
      casper.waitUntilVisible(".modal-dialog", function() {
        casper.test.assert(true, "tagging modal displayed");
        this.click("button[ng-click='cancel()']");
      });
      // Waits for the popup to disappear
      casper.waitWhileVisible(".modal-dialog", function() {
        casper.test.assert(true, "tagging dialog hidden");
      });

      // Clicks the Tagging icon, test if Modal becomes visible for file
      casper.then(function() {
        this.click("a[title='Tag File']");
        casper.test.assert(true, "tagging icon clicked for file");
      });
      // Waits for the popup to show
      casper.waitUntilVisible(".modal-dialog", function() {
        casper.test.assert(true, "tagging modal displayed");
        this.click("button[ng-click='cancel()']");
      });
      // Waits for the popup to disappear
      casper.waitWhileVisible(".modal-dialog", function() {
        casper.test.assert(true, "tagging dialog hidden");
      });

      // Clicks the Trash button, to send the file to the Trash
      casper.then(function() {
        this.click("button[ng-click='trashButtonClick()']");
        casper.test.assert(true, "send to trash button clicked");
      });

      // Waits for the moving to trash info message to show
      casper.waitUntilVisible(".panel-info", function() {
        casper.test.assert(true, "files are being moved to trash");
      });

      // Waits for the moving to trash info message to hide
      casper.waitWhileVisible(".panel-info", function() {
        casper.test.assert(true, "files successfully moved to trash");
      });
    }
  });
};
