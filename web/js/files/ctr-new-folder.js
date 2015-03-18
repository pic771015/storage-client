"use strict";

angular.module("risevision.storage.files")
.controller("NewFolderCtrl", ["$scope","$modalInstance", "FileListService","GAPIRequestService","$stateParams",
    "$rootScope", "$translate",
function($scope, $modalInstance, listSvc, requestSvc, $stateParams, $rootScope, $translate) {
  $scope.duplicateFolderSpecified = false;
  $scope.accessDenied = false;
  $scope.serverError = false;
  $scope.waitingForResponse = false;

  $scope.ok = function() {
    var requestParams;
    if (!$scope.folderName) {$scope.folderName = "";}
    $scope.folderName = $scope.folderName.replace(/\//g,"");
    if (listSvc.getFileNameIndex($scope.folderName + "/") > -1) {
      $scope.duplicateFolderSpecified = true;
      return;
    }
    if ($scope.folderName !== "") {
      requestParams = {
        "companyId": $stateParams.companyId,
        "folder": decodeURIComponent($stateParams.folderPath || "") + $scope.folderName
      };
      $scope.waitingForResponse = true;
      requestSvc.executeRequest("storage.createFolder", requestParams).then(function (resp) {
        console.log(resp);
        $scope.waitingForResponse = false;
        if (resp.code === 200) {
          $rootScope.$emit("refreshSubscriptionStatus", "trial-available");
          listSvc.refreshFilesList();
          $modalInstance.close($scope.folderName);
        } else if (resp.code === 403 && resp.message.indexOf("restricted-role") === -1) {
          $translate("storage-client." + resp.message, { username: resp.userEmail }).then(function(msg) {
            $scope.accessDenied = true;
            $scope.accessDeniedMessage = msg;
          });
        } else if (resp.code === 403) {
          $scope.accessDenied = true;
        } else {
          $scope.respCode = resp.code;
          $scope.accessDenied = true;
        }
      });
    }
  };
  $scope.cancel = function() {
      $modalInstance.dismiss("cancel");
  };
}])
;
