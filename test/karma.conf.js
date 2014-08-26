"use strict";
module.exports = function(config){
  config.set({

    basePath : "../",

    frameworks: ["mocha", "chai", "chai-as-promised"],

    browsers : ["PhantomJS"],

    reporters: ["spec"],

    specReporter: {"maxLogLines": 5},

    plugins : [
            "karma-firefox-launcher",
            "karma-mocha",
            "karma-chai",
            "karma-chai-plugins",
            "karma-phantomjs-launcher",
            "karma-spec-reporter"
            ],

    // web server port
    port: 9876,
    logLevel: config.LOG_INFO,
    
    // enable / disable colors in the output (reporters and logs)
    colors: true

  });
};
