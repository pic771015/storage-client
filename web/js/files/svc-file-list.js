"use strict";
angular.module("gapi-file", ["gapi", "medialibraryServices"])
.factory("FileListService", ["LocalFiles", "GAPIRequestService", "$stateParams",
function (LocalFiles, requestor, $stateParams) {
  var svc = {};
  svc.filesDetails = {files: []
                     ,localFiles: false
                     ,totalBytes: 0
                     ,checkedCount: 0
                     ,folderCheckedCount: 0};

  svc.statusDetails = {code: 200};

  svc.addFile = function(newFile) {
    var existingFileNameIndex;
    for (var i = 0, j = svc.filesDetails.files.length; i < j; i += 1) {
      if (svc.filesDetails.files[i].name === newFile.name) {
        existingFileNameIndex = i;
        break;
      }
    }

    if (existingFileNameIndex) {
      svc.filesDetails.files.splice(existingFileNameIndex, 1, newFile);
    } else {
      svc.filesDetails.files.push(newFile);
    }
  };

  svc.resetSelections = function() {
    svc.filesDetails.files.forEach(function(val) {
      val.isChecked = false;
    });
    svc.filesDetails.folderCheckedCount = svc.filesDetails.checkedCount = 0;
  };

  svc.refreshFilesList = function () {
    var params = {companyId: $stateParams.companyId};
    if ($stateParams.folderPath) {
      params.folder = decodeURIComponent($stateParams.folderPath);
    }

    svc.statusDetails.code = 202;

    if (!$stateParams.companyId) {
      svc.filesDetails.localFiles = true;
      return LocalFiles.query().$promise.then(function(resp) {
        return processFilesResponse({"files": resp, "code": 200});
      });
    }

    svc.filesDetails.localFiles = false;
    return requestor.executeRequest("storage.files.get", params)
    .then(function (resp) {
      return processFilesResponse(resp);
    });

    function processFilesResponse(resp) {
      if (resp.files) {
        svc.filesDetails.totalBytes = resp.files.reduce(function(prev, next) {
        return prev + parseInt(next.size);
        }, 0);

        console.log(svc.filesDetails.totalBytes + " bytes in " +
        resp.files.length + " files");
      }
      svc.filesDetails.files = resp.files || [];
      svc.statusDetails.code = resp.code;
      return resp;
    }
  };
  return svc;
}]);
