/* global document: false, casper: false, document */
/* jshint globalstrict: true */

"use strict";

var system = require("system");
var PROD = !("local" in casper.cli.options);
var port = system.env.E2E_PORT || 8000;
var url = PROD ? "http://storage.risevision.com" : ("http://localhost:" + port + "/index.html");

var localServerPort = system.env.E2E_LOGIN_PORT || 8888;
var localServerLoginUrlRoot = "http://localhost:" + localServerPort;
var localServerLoginUrl = localServerLoginUrlRoot + "/_ah/login?continue=%2f";

var customHeaders = {
  "Accept-Language": "en-US,en;q=0.8"
};

require("casper-options.js")(casper);
require("popup-handlers.js")(casper);
require("circleci-company.js")(casper, PROD);

casper.test.begin("Connecting to " + url, function suite(test) {
  casper.start();

  casper.then(function() {
    casper.page.customHeaders = customHeaders;
  });

  var captureCount = 0;
  var waitTimeoutCallback = function(passfail, msg) {
    return function() {
      captureCount += 1;
      casper.capture("e2e-log/" + captureCount + ". " + msg.replace(/ /g, "-") + ".png");
      test.assert(passfail, msg);
    };
  }; 

  var pass = function(msg) {return waitTimeoutCallback(true, msg);};
  var fail = function(msg) {return waitTimeoutCallback(false, msg);};

  if(!PROD) {
    casper.then(function localAppengineDevserverLogin() {
      casper.open(localServerLoginUrl).then(function() {
        this.evaluate(function(user) {
          document.querySelector("#email").value = user || "jenkins@risevision.com";
          document.querySelector("#btn-login").click();
        }, casper.cli.options.user);
      });

      casper.test.assert(true, "displayed local login");
    });

    casper.waitForUrl(localServerLoginUrlRoot, function() {
      casper.test.assert(true, "processed local login");
    });
  }

  casper.then(function() {
    casper.open(url, { headers: customHeaders }).then(function(resp) {
      casper.echo("Response " + resp.status + " " + resp.statusText + " from " + resp.url);
      casper.viewport(1024, 768);
    });
  });


  casper.then(function() {
    this.click(".sign-in.top-auth-button");
    casper.test.assert(true, "clicked on common header login button");
  });

  require("google-login.js")(casper, pass, fail);

  casper.waitForSelector("a[title='Trash']",
  pass("file listing loaded"), fail("file listing failed"));

  require("../../web/js/buttons/folder-create-e2e.js")(casper, pass, fail);
  require("main-upload-test-file.js")(casper, pass, fail);
  require("../../web/js/tagging/tagging-file-normal-e2e.js")(casper, pass, fail);
  require("../../web/js/buttons/file-trash-e2e.js")(casper, pass, fail);
  require("../../web/js/buttons/file-restore-trash-e2e.js")(casper, pass, fail);
  require("../../web/js/buttons/folder-move-trash-e2e.js")(casper, pass, fail);
  require("../../web/js/buttons/folder-delete-e2e.js")(casper, pass, fail);
  require("../../web/js/modal/modal-e2e.js")(casper, pass, fail);
  require("done.js")(casper, pass, fail);

  casper.run(function() {
    test.done();
  });
});
