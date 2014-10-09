/* global document: false, casper: false */
/* jshint globalstrict: true */

//Run tests:
//casperjs --cookies-file=$HOME/.storage-client-e2e-storage-full-cookies \
//[--user=XXXXXX] [--password=XXXXXX] test test/e2e/tests-storage-full.js
//Cookie file will be saved so that password option is only required once.
"use strict";
var port = require("system").env.E2E_PORT || 8000;
var url = "http://localhost:" + port + "/storage-full.html";
var popupClosed = false;
var imgdir = "test/e2e/storage-full/";

casper.options.waitTimeout = 60000;

casper.on("popup.closed", function(page) {
	popupClosed = true;
});

casper.test.begin("Connecting to " + url, function suite(test) {
  casper.start(url, function(resp) {
    casper.echo("Response " + resp.status + " " + resp.statusText +
              " from " + resp.url);
    casper.viewport(1024, 768);
  });

  casper.then(function() {
    this.click(".sign-in.top-auth-button");
  });

  casper.waitForPopup(/accounts\.google\.com/, function() {
  	
  });

  casper.withPopup(/accounts\.google\.com/, function() {
    this.evaluate(function(user, pass) {
      if (document.title === "Request for Permission") {
        document.querySelector("#submit approve access").click();
      }

      if (document.title === "Sign in - Google Accounts") {
      	document.querySelector("#Email").value = user || "jenkins@risevision.com";
        document.querySelector("#Passwd").value = pass;
        document.querySelector("#signIn").click();
      }

      return document.title;
    }, casper.cli.options.user, casper.cli.options.password);

    casper.capture(imgdir + "login_window.png");
  });

  casper.then(function() {
  	casper.capture(imgdir + "test1.png");
  	casper.waitFor(function() { return popupClosed; });
  });

  casper.then(function() {
  	casper.capture(imgdir + "test2.png");
  	casper.waitUntilVisible("#msg-logging-in", function() {
  		test.assert(true, "Logging in message displayed");
  	});
  });

  casper.then(function() {
    casper.capture(imgdir + "test3.png");
  	
  	casper.waitWhileVisible("#msg-logging-in", function() {
  		test.assert(true, "Logging in message hidden");
  	});
  });

  casper.then(function() {
    casper.capture(imgdir + "test4.png");

  	casper.waitUntilVisible("#msg-loading-files", function() {
  		test.assert(true, "Loading files message displayed");
  	});
  });

  casper.then(function() {
    casper.capture(imgdir + "test5.png");

  	casper.waitWhileVisible("#msg-loading-files", function() {
  		test.assert(true, "Loading files message hidden");
  		test.assertNotVisible(".notifications", "Notifications section should be hidden");
  		test.assertVisible("#storage-modal-embedded", "storage-modal iframe should be visible");
  	});
  });

  casper.then(function() {
    casper.capture(imgdir + "done.png");
    casper.echo("DONE. Final screenshot saved to test/e2e/done.png");
  });

  casper.run(function() {
    test.done();
  });
});
