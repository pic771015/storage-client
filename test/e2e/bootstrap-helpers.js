"use strict";

var fs = require("fs"),
until = require("selenium-webdriver").until;

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

  obj.waitForObstructions = function waitForObstructions() {
    var until = require("selenium-webdriver").until,
    obstruction;

    waitForObstruction({"css": "div.spinner-backdrop"}, "visibility");
    waitForObstruction({"css": "div.modal-backdrop.fade"}, "staleness");

    function waitForObstruction(selector, condition) {
      var waitCond = until.elementIsNotVisible;
      if (condition === "staleness") {waitCond = until.stalenessOf;}

      driver.isElementPresent(selector)
      .then(function(present) {
        if (!present) {return;}
        console.log("waiting for " + JSON.stringify(selector));

        obstruction = driver.findElement(selector);
        driver.wait(waitCond(obstruction), 15000, "obstruction " + waitCond);
      });
    }
  };

  obj.logMessage = function logMessage(msg) {
    driver.controlFlow().execute(function(){console.log(msg);});
  };

  obj.findAndClickWhenVisible = function findAndClickWhenVisible(selector) {
    driver.wait(until.elementLocated(selector), 4000, JSON.stringify(selector));
    driver.findElement(selector).then(function(el) {
      driver.wait(until.elementIsVisible(el), 6000, JSON.stringify(selector)).then(function() {
        driver.wait(until.elementIsEnabled(el), 7000, JSON.stringify(selector));
      }).then(function() {
        el.click();
      });
    });
  };

  obj.includeTestFile = function loadTestFile(filepath) {
    obj.logMessage(filepath);
    require(filepath)(driver);
    obj.waitForObstructions();
  };

  return obj;
};
