"use strict";
module.exports = function(casper, pass, fail) {
  var rvaPresentationUrl = "http://rva.risevision.com/#PRESENTATION_MANAGE/company=f114ad26-949d-44b4-87e9-8528afc76ce4";
  var expectedUrlFromStorageModal = "https://storage.googleapis.com/risemedialibrary-a6397169-ad53-4163-9e08-da3e53f3a413/test1";

  casper.then(function() {
    casper.log("loading " + rvaPresentationUrl, "info");
  });

  casper.thenOpen(rvaPresentationUrl);
  
  casper.waitForSelector("div[title='Add Placeholder']",
  pass("new presentation found"), fail("could not open new presentation"));

  casper.then(function() {
    casper.mouse.move("div[title='Add Placeholder']");
    casper.mouse.down("div[title='Add Placeholder']");
    casper.mouse.up("div[title='Add Placeholder']");
  });

  casper.then(function accessStorageModal() {
    casper.clickLabel("Add", "a");
    casper.clickLabel("Image", "td");
    casper.clickLabel("Storage", "span");
  });

  casper.waitFor(function handleStorageModal() {
    return casper.evaluate(function findAndClickFile() {
      return checkDocFramesForTestFile(document);

      function checkDocFramesForTestFile(doc) {
        var frames = doc.querySelectorAll("iframe");
        var fileLink = doc.querySelector("a[title='test1']");

        if (fileLink) {
          fileLink.click();
          return true;
        } else {
          return Array.prototype.some.call(frames, function(frame){
            var doc = frame.contentDocument;
            if (doc) {return checkDocFramesForTestFile(doc);}
            return false;
          });
        }
      }
    });
  },pass("storage loaded in-app"), fail("storage not loaded"));

  casper.waitFor(function expectUrlInInputField() {
    return casper.evaluate(function(expectedUrl) {
      var textBoxElements = document.querySelectorAll("input.rdn-TextBoxLong");
      return Array.prototype.some.call(textBoxElements, function(el) {
        return el.value === expectedUrl;
      });
    }, expectedUrlFromStorageModal);
  }, pass("storage modal returned expected url"), fail("expected url not found"));

  casper.wait(900); //prevents hang on exit attempt after successful test runs
};
