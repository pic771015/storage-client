"use strict";

var until = require("selenium-webdriver").until,
webdriver = require("selenium-webdriver"),

locators = {
  "userProfile": {"xpath": "//div[contains(@class,'user-id')]/span"},
  "selectSubCompany": {"xpath": "//a[text()='Select Sub-Company']"},
  "setCompany": {"css": "div[ng-click='setCompany(company)']"},
  "homeCompany": {"css": "a[ng-click='switchToMyCompany()']"},
  "trial": {"xpath": "//div[@id='subscription-status']//span[contains(.,'Free')]"},
  "subs": {"xpath": "//div[@id='subscription-status']//span[contains(.,'Subs')]"},
};

function findVisibleSelector(selector) {
  return function findWithDriver(driver) {
    console.log("Finding visible among " + JSON.stringify(selector));
    var links = driver.findElements(selector);
    return webdriver.promise.filter(links, function(link) {
      return link.isDisplayed();
    }).then(function(visibleLinks) {
      return visibleLinks[0];
    });
  };
}

module.exports = function(driver) {
  driver.wait(until.elementLocated(locators.subs), 5000, "initial subscribed");

  driver.wait(until.elementLocated(locators.userProfile), 5000, "profile");
  driver.findElement(findVisibleSelector(locators.userProfile)).click();

  driver.wait(until.elementLocated(locators.selectSubCompany), 5000, "drop down");
  driver.findElement(findVisibleSelector(locators.selectSubCompany)).click();

  driver.wait(until.elementLocated(locators.setCompany), 9000, "company listing");
  driver.findElement(locators.setCompany).click();

  driver.wait(until.elementLocated(locators.trial), 5000, "free trial");

  driver.wait(until.elementLocated(locators.homeCompany), 5000, "home company");
  driver.findElement(locators.homeCompany).click();

  driver.wait(until.elementLocated(locators.subs), 5000, "again subscribed");
};

