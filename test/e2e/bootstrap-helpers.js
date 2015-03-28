"use strict";

module.exports = function(driver, fs) {
  var obj = {};

  obj.logAndSnap = function logAndSnap(msg) {
    return function() {
      driver.takeScreenshot().then(function(data) {
        var base64Data = data.replace(/^data:image\/png;base64,/,"");
        fs.writeFile(msg.replace(/ /g, "-") + ".png", base64Data, "base64",
        function(err) {
          if(err) {console.log(err);}
        });
      });
      console.log(msg);
    };
  };

  obj.waitForSpinner = function waitForSpinner() {
    var until = require("selenium-webdriver").until,
    spinner = driver.findElement({"css": "div.spinner-backdrop"});

    driver.wait(until.elementIsNotVisible(spinner), 5000, "spinner hidden");
    driver.sleep(200);
  };

  obj.includeTestFile = function loadTestFile(filepath) {
    require(filepath)(driver);
    obj.waitForSpinner();
  };

  return obj;
};
