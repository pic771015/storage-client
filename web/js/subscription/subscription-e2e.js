"use strict";

var until = require("selenium-webdriver").until,
webdriver = require("selenium-webdriver"),

locators = {
  "userProfile": {"xpath": "//div[@class='user-id']/span[1]"},
  "selectSubCompany": {"xpath": "//a[text()='Select Sub-Company']"},
  "setCompany": {"css": "div[ng-click='setCompany(company)']"},
  "homeCompany": {"css": "a[ng-click='switchToMyCompany()']"},
  "trial": {"xpath": "//div[@id='subscription-status']//span[contains(.,'Free')]"},
  "subs": {"xpath": "//div[@id='subscription-status']//span[contains(.,'Subs')]"},
};

function findVisibleSubCompanyLink(driver) {
  var links = driver.findElements(locators.selectSubCompany);
  return webdriver.promise.filter(links, function(link) {
    return link.isDisplayed();
  }).then(function(visibleLink) {
    return visibleLink[0];
  });
}

module.exports = function(driver) {
  driver.wait(until.elementLocated(locators.subs), 5000, "initial subscribed");

  driver.wait(until.elementLocated(locators.userProfile), 5000, "profile");
  driver.findElement(locators.userProfile).click();

  driver.wait(until.elementLocated(locators.selectSubCompany), 5000, "drop down");
  driver.findElement(findVisibleSubCompanyLink).click();

  driver.wait(until.elementLocated(locators.setCompany), 9000, "company listing");
  driver.findElement(locators.setCompany).click();

  driver.wait(until.elementLocated(locators.trial), 5000, "free trial");

  driver.wait(until.elementLocated(locators.homeCompany), 5000, "home company");
  driver.findElement(locators.homeCompany).click();

  driver.wait(until.elementLocated(locators.subs), 5000, "again subscribed");
};

