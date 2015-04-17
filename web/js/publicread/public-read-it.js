"use strict";

function verifyCompanyId(id) {
  return angular.element
  (document.querySelectorAll
  ("div[ng-controller='PublicReadController']")[0])
  .scope().companyId === id;
}

module.exports = function(driver) {
  var controllerStandalonePromise = driver.executeScript(verifyCompanyId, "1234");
  driver.wait(controllerStandalonePromise , 7000, "standalone");
  driver.logMessage("public read controller active in standalone client");

  driver.get("http://localhost:8000/modal.html#/files/1234");
  var controllerModalPromise = driver.executeScript(verifyCompanyId, "1234");
  driver.wait(controllerModalPromise , 9000, "modal");
  driver.logMessage("public read controller active in modal");
};
