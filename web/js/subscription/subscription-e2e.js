"use strict";

var until = require("selenium-webdriver").until,

locators = {
  "userProfile": {"xpath": "//div[contains(@class,'user-id')]/span"},
  "selectSubCompany": {"css": "a[ng-click='switchCompany()']"},
  "setCompany": {"css": "div[ng-click='setCompany(company)']"},
  "homeCompany": {"css": "a[ng-click='switchToMyCompany()']"},
  "trial": {"xpath": "//div[@id='subscription-status']//span[contains(.,'Free')]"},
  "subs": {"xpath": "//div[@id='subscription-status']//span[contains(.,'Subs')]"},
};

module.exports = function(driver) {
  driver.wait(until.elementLocated(locators.subs), 5000, "initial subscribed");

  driver.findAndClickWhenVisible(locators.userProfile);

  driver.findAndClickWhenVisible(locators.selectSubCompany);

  driver.findAndClickWhenVisible(locators.setCompany);

  driver.wait(until.elementLocated(locators.trial), 15000, "free trial");

  driver.wait(until.elementLocated(locators.homeCompany), 15000, "home company");
  driver.findElement(locators.homeCompany).click();

  driver.wait(until.elementLocated(locators.subs), 15000, "again subscribed");
};

