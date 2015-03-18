"use strict";

module.exports = function(casper) {
  var foundFile = false;

  // Marks the first file if found as selected
  casper.then(function() {
    this.evaluate(function () {
      var trs = document.querySelectorAll("#filesTable tbody tr");

      for (var i = 0; i < trs.length; i++) {
        if (trs[i].children[1].children[0].children[0].classList.contains("fa-file") &&
          trs[i].children[1].children[0].textContent !== " /Previous Folder") {
          trs[i].children[0].children[0].click();
          break;
        }
      }
    });
    
    if (foundFile) {
      // Checks if file is found that you can restore it from trash
      casper.then(function () {
        casper.test.assertVisible("button[title='Restore From Trash']");
        this.click("button[ng-click='restoreButtonClick()']");
        casper.test.assert(true, "restore button clicked");
      });

      // Waits for the moving to restoring message to show
      casper.waitUntilVisible(".panel-info", function () {
        casper.test.assert(true, "file is being restored");
      });

      // Waits for the moving to trash info message to hide
      casper.waitWhileVisible(".panel-info", function () {
        casper.test.assert(true, "file successfully restored");
      });
    }
  });
};
