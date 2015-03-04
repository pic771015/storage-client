"use strict";

module.exports = function(casper) {
  // Clicks the Create Folder button
  casper.then(function() {
    this.click("button[ng-click=\"newFolderButtonClick('md')\"]");
  });

  // Waits for the popup to show
  casper.waitUntilVisible(".modal-dialog", function() {
    casper.test.assert(true, "create folder displayed");

    this.sendKeys("#newFolderInput", "test-folder");
    this.click("button[ng-click='ok()']");
  });

  // Waits for the popup to disappear
  casper.waitWhileVisible(".modal-dialog", function() {
    casper.test.assert(true, "confirm create folder dialog hidden");
  });

  // Checks the newly created folder shows in the file listing. If it exists, its checkbox is clicked
  casper.waitFor(function() {
    return casper.evaluate(function() {
      var trs = document.querySelectorAll("#filesTable tbody tr");

      for(var i = 0; i < trs.length; i++) {
        if(trs[i].children[0].children[1].textContent.indexOf("test-folder/") >= 0) {
          trs[i].children[0].children[0].click();
          return true;
        }
      }
      return false;
    });
  }, function() {
    casper.test.assert(true, "folder succesfully created and clicked");
  });
};
