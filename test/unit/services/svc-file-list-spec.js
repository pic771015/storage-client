/*jshint expr:true */
"use strict";
function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}

describe("Services: FileListService", function() {
  beforeEach(module("gapi-file"));

  beforeEach(module(function ($provide) {
    $provide.service("GAPIRequestService", function() {
      var svc = {};
      svc.executeRequest = function() {
        var response = {code: 200
                      ,files: [{"name":"test1", "size": 5}
                              ,{"name":"test1", "size": 3}]};
        return new Q(response);
      };

      return svc;
    });

    $provide.value("LocalFiles", {query: function() {
      return {"$promise": new Q([{size: 8},{size: 8}])};
    }});
  }));

  it("should exist", function () {
    var fileListSvc = getService("FileListService");
    expect(fileListSvc).be.defined;
  });

  it("should get local files", function () {
    var fileListSvc = getService("FileListService");
    return fileListSvc.refreshFilesList()
    .then(function() {
      expect(fileListSvc.filesDetails.localFiles).to.equal(true);
      expect(fileListSvc.filesDetails.files.length).to.equal(2);
    });
  });

  it("should get company files", function () {
    var fileListSvc = getService("FileListService");
    return fileListSvc.refreshFilesList("fj243g43g4-g43g43g43g-34g43")
    .then(function() {
      expect(fileListSvc.filesDetails.files.length).to.equal(2);
    });
  });
});
