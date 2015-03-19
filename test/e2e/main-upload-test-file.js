"use strict";

module.exports = function(casper, pass, fail) {
  casper.then(function uploadFile() {
    casper.evaluate(function() {
      var injector = angular.element("#file").injector();
      var file = new Blob(["test data"], {"type": "text/plain"});
      file.name = "test1";

      injector.invoke(["FileUploader", function(uploader) {
        uploader.addToQueue([file]);
      }]);
    });
  });

  casper.waitUntilVisible("a[title='test1']",
  null, fail("file-upload-fail.png", "file not uploaded"));
};
