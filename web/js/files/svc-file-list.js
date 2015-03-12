"use strict";
angular.module("gapi-file", ["gapi", "medialibraryServices","ui.router"])
.factory("FileListService", ["LocalFiles", "GAPIRequestService", "$stateParams", "$rootScope",
function (LocalFiles, requestor, $stateParams, $rootScope) {
  var svc = {};
  svc.filesDetails = {files: []
                     ,localFiles: false
                     ,checkedCount: 0
                     ,folderCheckedCount: 0
                     ,checkedItemsCount: 0};

  svc.statusDetails = {code: 200};
  svc.taggingCheckedItems = [];
  svc.checkedTagging = false;

  //on all state Changes do not hold onto checkedFiles list
  $rootScope.$on("$stateChangeStart", function(){
    svc.checkedTagging = false;
    svc.filesDetails.checkedCount = 0;
    svc.filesDetails.folderCheckedCount = 0;
    svc.filesDetails.checkedItemsCount = 0;
  });

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

  svc.getFileNameIndex = function(fileName) {
    for (var i = 0, j = svc.filesDetails.files.length; i < j; i += 1) {
      if (svc.filesDetails.files[i].name === fileName) {
        return i;
      }
    }
    return -1;
  };

  svc.resetSelections = function() {
    svc.filesDetails.files.forEach(function(val) {
      val.isChecked = false;
    });
    
    svc.filesDetails.checkedCount = 0;
    svc.filesDetails.folderCheckedCount = 0;
    svc.filesDetails.checkedItemsCount = 0;
  };

  svc.removeFiles = function(files) {
    var oldFiles = svc.filesDetails.files;
    var removedSize = 0;

    for(var i = oldFiles.length - 1; i >= 0; i--) {
      if(files.indexOf(oldFiles[i]) >= 0) {
        removedSize += parseInt(oldFiles[i].size);
        oldFiles.splice(i, 1);
      }
    }
  };

  svc.refreshFilesList = function () {
    var params = {companyId: $stateParams.companyId};
    if ($stateParams.folderPath) {
      params.folder = decodeURIComponent($stateParams.folderPath);
      svc.statusDetails.folder = params.folder;
    }
    else {
      svc.statusDetails.folder = "/";
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
        if(svc.checkedTagging){
          resp.files.forEach(function(i){
            if(svc.taggingCheckedItems.indexOf(i.name) > -1){
              i.isChecked = true;
            }
            else {
              i.isChecked = false;
            }
          });
        }
      return processFilesResponse(resp);
    });

    function processFilesResponse(resp) {
      var TRASH = "--TRASH--/";
      var parentFolder = decodeURIComponent($stateParams.folderPath);
      var parentFolderFound = false;

      resp.files = resp.files || [];

      for(var i = 0; i < resp.files.length; i++) {
        var file = resp.files[i];

        if(file.name === parentFolder) {
          parentFolderFound = true;
          delete file.size;
          delete file.updated;
          break;
        }
      }

      if(!parentFolderFound && parentFolder.indexOf(TRASH) === 0) {
        resp.files.unshift({ name: parentFolder, size: "", updated: null });
      }          

      svc.filesDetails.files = resp.files || [];
      svc.statusDetails.code = resp.code;

      if(!$stateParams.folderPath || !parentFolder || parentFolder === "/") {
        svc.filesDetails.files.splice(1, 0, { name: TRASH, size: "", updated: null });
      }
        
      return resp;
    }
  };

  return svc;
}]);
