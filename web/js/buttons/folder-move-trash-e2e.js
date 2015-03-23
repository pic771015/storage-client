"use strict";

module.exports = function(casper) {
  // Clicks the Trash button, to send the folder to the Trash
  casper.then(function() {
    this.click("button[ng-click='trashButtonClick()']");
    casper.test.assert(true, "send to trash button clicked");
  });

  // Waits for the moving to trash info message to show
  casper.waitUntilVisible(".panel-info", function() {
    casper.test.assert(true, "folder is being moved to trash");
  });

  // Waits for the moving to trash info message to hide
  casper.waitWhileVisible(".panel-info", function() {
    casper.test.assert(true, "folder successfully moved to trash");
  });

  // Clicks the Show Trash button, to list the files on Trash
  casper.then(function() {
    var sufix = ""; //"[ng-show='fileIsFolder(file) || !storageFull']";

    this.click("a[title='Trash']" + sufix);
    // When using PhantomJS, setting the locale is ignored (it does not happen with SlimerJS)
    //this.click("a[title='Papelera']" + sufix);

    casper.test.assert(true, "trash button clicked");
  });

  // Waits for the loading info message to show
  casper.waitUntilVisible(".alert-info", function() {
    casper.test.assert(true, "trash files are being loaded");
  });

  // Waits for the trash file listing to show
  casper.waitUntilVisible("#filesTable", function() {
    casper.test.assert(true, "trash displayed");
  });

  // Checks the newly moved to trash folder shows in the file listing
  casper.waitUntilVisible("a[title*='test-folder']", function() {
    casper.test.assert(true, "folder moved to trash succesfully");
  });

  // Marks the folder as selected
  casper.then(function() {
    this.evaluate(function() {
      var trs = document.querySelectorAll("#filesTable tbody tr");

      for(var i = 0; i < trs.length; i++) {
        if(trs[i].children[0].children[1].textContent.indexOf("test-folder/") >= 0) {
          trs[i].children[0].children[0].click();
          break;
        }
      }
    });

    // Test that tagging button doesn't exist in trash
    casper.echo("Checking tagging buttons on selected folder in trash not visible");
    casper.test.assertNotVisible("a[title='Tag File']");
    casper.test.assertNotVisible("button[title='Tagging']");
    casper.echo("folder found and tag icons and buttons not visible");
    casper.test.assert(true, "test-folder in trash checked");
  });
};
