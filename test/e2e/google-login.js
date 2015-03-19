"use strict";
module.exports = function(casper) {
  casper.then(function() {
    casper.log("Beginning handling of google login.", "info");
    casper.waitForUrl(/accounts\.google\.com/, function() {
      this.evaluate(function(user, pass) {
        console.log("Entering google account information.");
        if (document.title === "Request for Permission") {
          document.querySelector("#submit approve access").click();
        }

        if (document.title === "Sign in - Google Accounts") {
          if (document.querySelector("#choose-account-0") !== null) {
            document.querySelector("#choose-account-0").click();
          } else {
            document.querySelector("#Email").value = user || "jenkins@risevision.com";
            document.querySelector("#Passwd").value = pass;
            document.querySelector("#signIn").click();
          }
        }

        console.log("Account information entered.");
        return document.title;
      }, casper.cli.options.user, casper.cli.options.password);
    });
  });
};
