"use strict";

module.exports = function(casper) {
  casper.log("Loading popup handlers.", "info");
  casper.on("popup.loaded", function(page) {
    casper.log("Pop up page! " + page.title + ": " + page.url, "info");
  });
};
