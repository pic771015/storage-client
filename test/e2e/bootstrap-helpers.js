"use strict";

var fs = require("fs");

module.exports = function(driver) {
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

  obj.waitForSpinner = function waitForSpinner(msg) {
    var until = require("selenium-webdriver").until,
    spinner;

    driver.isElementPresent({"css": "div.spinner-backdrop"})
    .then(function(present) {
      if (!present) {return;}
      spinner = driver.findElement({"css": "div.spinner-backdrop"});
      driver.wait(until.elementIsNotVisible(spinner), 15000, "spinner hidden");
    });
  };

  obj.includeTestFile = function loadTestFile(filepath) {
    driver.controlFlow().execute(function(){console.log(filepath);});
    require(filepath)(driver);
    obj.waitForSpinner("at end of tasks for " + filepath);
  };

  return obj;
};
