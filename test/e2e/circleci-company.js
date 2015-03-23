"use strict";

module.exports = function(casper, PROD) {
  if(PROD) {
  	casper.cli.options.companyId = "a6397169-ad53-4163-9e08-da3e53f3a413";
  }
  else {
  	casper.cli.options.companyId = "ac57def2-834e-4ecd-8b91-44ca14524fd0";
  }
};
