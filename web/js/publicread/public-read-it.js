"use strict";

module.exports = function(driver) {
  var publicReadControllerPromise = driver.executeScript(function() {
    return angular.element
    (document.querySelectorAll
    ("div[ng-controller='PublicReadController']")[0])
    .scope().companyId.length > 0;
  });

  driver.wait(publicReadControllerPromise, 2000, "controller was loaded");
  driver.logMessage("public read controller active");
};
