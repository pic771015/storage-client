"use strict";
module.exports = function(casper) {
  casper.then(function() {
    casper.capture("e2e-log/done.png");
    casper.echo("DONE");
  });
};
