/* global document: false, casper: false, document */
/* jshint globalstrict: true */

//Run tests:
//casperjs --cookies-file=$HOME/.storage-client-e2e-storage-full-cookies \
//[--user=XXXXXX] [--password=XXXXXX] test test/e2e/tests-storage-full.js
//Cookie file will be saved so that password option is only required once.
"use strict";

var system = require("system");
var PROD = !("local" in casper.cli.options);
var port = system.env.E2E_PORT || 8000;
var url = PROD ? "http://storage.risevision.com" : ("http://localhost:" + port + "/index.html");

var loginPort = system.env.E2E_LOGIN_PORT || 8888;
var loginUrlRoot = "http://localhost:" + loginPort;
var loginUrl = loginUrlRoot + "/_ah/login?continue=%2f";

var customHeaders = {
  "Accept-Language": "en-US,en;q=0.8"
};

require("casper-options.js")(casper);
require("popup-handlers.js")(casper);
require("circleci-company.js")(casper, PROD);

casper.on("remote.message", function(msg) {
  casper.echo("DOM console: " + msg);
});

casper.test.begin("Connecting to " + url, function suite(test) {
  casper.start();

  casper.then(function() {
    casper.page.customHeaders = customHeaders;
  });

  if(!PROD) {
    casper.then(function() {
      casper.open(loginUrl).then(function() {
        this.evaluate(function(user) {
          document.querySelector("#email").value = user || "jenkins@risevision.com";
          document.querySelector("#btn-login").click();
        }, casper.cli.options.user);
      });

      casper.test.assert(true, "displayed local login");
    });

    casper.waitForUrl(loginUrlRoot, function() {
      casper.test.assert(true, "processed local login");
    });
  }

  casper.then(function() {
    casper.open(url, { headers: customHeaders }).then(function(resp) {
      casper.echo("Response " + resp.status + " " + resp.statusText + " from " + resp.url);
      casper.viewport(1024, 768);
    });
  });

  // Clicks the Sign In button
  casper.then(function() {
    this.click(".sign-in.top-auth-button");
    casper.test.assert(true, "clicked on login button");
  });

  // Enters user credentials
  casper.waitForUrl(/accounts\.google\.com/, function() {
    this.evaluate(function(user, pass) {
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

      return document.title;
    }, casper.cli.options.user, casper.cli.options.password);

    casper.test.assert(true, "entered login information");
  });

  // Waits until the file listing is loaded
  casper.then(function() {
    casper.log("Waiting for files to appear.", "info");

    casper.waitUntilVisible("#filesTable", function() {
      casper.test.assert(true, "files have been listed");
    });
  });

  require("../../web/js/buttons/folder-create-e2e.js")(casper, test);
  //require("main-upload-test-file.js")(casper, test);
  require("../../web/js/tagging/tagging-file-normal-e2e.js")(casper, test);
  require("../../web/js/buttons/folder-move-trash-e2e.js")(casper, test);
  require("../../web/js/buttons/folder-delete-e2e.js")(casper, test);
  require("../../web/js/buttons/file-restore-trash-e2e.js")(casper, test);

  casper.then(function() {
    casper.capture("done.png");
    casper.echo("DONE");
  });

  casper.run(function() {
    test.done();
  });
});
