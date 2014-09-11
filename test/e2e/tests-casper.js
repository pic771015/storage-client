/* global document: false, casper: false */
/* jshint globalstrict: true */

//Run tests:
//casperjs --cookies-file=$HOME/.storage-client-e2e-casper-cookies \
//[--password=XXXXXX] test test/e2e/tests-casper.js
//Cookie file will be saved so that password option is only required once.
"use strict";
var port = require("system").env.E2E_PORT || 8000;
var url = "http://localhost:"+port+"/storage-modal.html#/files/";

casper.options.waitTimeout = 15000;

casper.on("remote.message", function(msg) {
  casper.echo("DOM console: " + msg);
});

casper.on("waitFor.timeout", function() {
  casper.echo("Timeout screenshot saved to test/e2e/timeout.png");
  this.capture("test/e2e/timeout.png");
});

casper.on("step.error", function() {
  casper.echo("Error screenshot saved to test/e2e/error.png");
  this.capture("test/e2e/error.png");
});

casper.on("popup.loaded", function(page) {
  casper.echo("Popup loaded: " + page.title);
  page.evaluate(function(pass) {
    if (document.title === "Request for Permission") {
      document.querySelector("#submit approve access").click();
    }

    if (document.title === "Sign in - Google Accounts") {
      document.querySelector("#Email").value = "jenkins@risevision.com";
      document.querySelector("#Passwd").value = pass;
      document.querySelector("#signIn").click();
    }
  }, casper.cli.options.password);
});

casper.test.begin("Connecting to " + url, function suite(test) {
  casper.start(url, function(resp) {
    casper.echo("Response " + resp.status + " " + resp.statusText +
              " from " + resp.url);
    casper.viewport(1024, 768);
  });

  casper.then(function() {
    casper.waitWhileVisible("#gapiLoadNotice");
  });

  casper.then(function() {
    casper.click("#oauthNotice button");
  });

  casper.then(function() {
    casper.waitWhileVisible("#oauthNotice");
  });

  casper.then(function() {
    casper.waitFor(function() {
      return casper.evaluate(function() {
        return document.querySelector("#filesTable tbody").childElementCount > 0;
      });
    }, function() {casper.test.assert(true, "files have been listed");});
  });

  casper.then(function() {
    casper.capture("test/e2e/done.png");
    casper.echo("DONE. Final screenshot saved to test/e2e/done.png");
  });
  casper.run(function() {
    test.done();
  });
});
