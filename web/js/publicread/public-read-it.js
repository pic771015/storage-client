"use strict";
var promise = require("selenium-webdriver").promise;

function verifyCompanyId(id) {
  return angular.element
  (document.querySelectorAll
  ("div[ng-controller='PublicReadController']")[0])
  .scope().companyId === id;
}

module.exports = function(driver) {
  var controllerStandalonePromise = driver.executeScript(verifyCompanyId, "1234")
  .then(function(resp) {
    if (!resp) {return promise.rejected("incorrect companyId");}
  });

  driver.wait(controllerStandalonePromise , 2000, "standalone");
  driver.logMessage("public read controller active");
};
