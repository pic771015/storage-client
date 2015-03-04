/*jshint expr:true */

describe("Services: FileUploader", function() {
  "use strict";

  beforeEach(module("risevision.storage.upload"));

  it("should exist", function (done) {
    inject(function(FileUploader) {
      expect(FileUploader).be.defined;
      done();
    });
  });
});
