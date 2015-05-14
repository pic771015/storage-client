/*jshint expr:true */
"use strict";

var $stateParams = { folderPath: "" };

function getService(serviceName) {
  var injectedService;
  inject([serviceName, function(serviceInstance) {
    injectedService = serviceInstance;
  }]);
  return injectedService;
}

describe("Services: FileListService", function() {
  beforeEach(module("risevision.storage.files"));

  beforeEach(module(function ($provide) {
    $provide.service("$stateParams", function() {
      return $stateParams;
    });

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
      expect(fileListSvc.filesDetails.files.length).to.equal(3);
    });
  });

  it("should get company files", function () {
    var fileListSvc = getService("FileListService");
    return fileListSvc.refreshFilesList("fj243g43g4-g43g43g43g-34g43")
    .then(function() {
      expect(fileListSvc.filesDetails.files.length).to.equal(3);
    });
  });

  it("should add two files", function () {
    var fileListSvc = getService("FileListService");
    return fileListSvc.refreshFilesList()
    .then(function() {
      fileListSvc.addFile({ name: "file1.txt" });
      fileListSvc.addFile({ name: "file2.txt" });
      fileListSvc.addFile({ name: "file2.txt" });
      expect(fileListSvc.filesDetails.files.length).to.equal(5);
    });
  });

  it("should add one folder", function () {
    var fileListSvc = getService("FileListService");
    return fileListSvc.refreshFilesList()
    .then(function() {
      fileListSvc.addFile({ name: "folder/file1.txt" });
      fileListSvc.addFile({ name: "folder/file2.txt" });
      fileListSvc.addFile({ name: "folder/subFolder/file2.txt" });
      expect(fileListSvc.filesDetails.files.length).to.equal(4);
    });
  });

  it("should add one folder inside the current folder", function () {
    var fileListSvc = getService("FileListService");

    $stateParams.folderPath = "test/";
    fileListSvc.addFile({ name: "test/folder/file1.txt" });
    expect(fileListSvc.filesDetails.files.length).to.equal(1);
    expect(fileListSvc.filesDetails.files[0].name).to.equal("test/folder/");
  });
});
