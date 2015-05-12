"use strict";

angular.module("risevision.storage.modal", ["risevision.common.config", "risevision.storage.external"])
.controller("ModalWindowController", ["$scope", "CoreClientService", "$rootScope", "FULLSCREEN", "SELECTOR_TYPE",
function($scope, CoreClientService, $rootScope, FULLSCREEN, SELECTOR_TYPE) {
  $scope.FULLSCREEN = FULLSCREEN;
  $scope.SELECTOR_TYPE = SELECTOR_TYPE;
  $scope.singleFileSelector = SELECTOR_TYPE === "single-file";
  $scope.multipleFileSelector = SELECTOR_TYPE === "multiple-file";
  $scope.singleFolderSelector = SELECTOR_TYPE === "single-folder";

  if(!FULLSCREEN) {
    var loc = window.location.href;
    var filesPath = loc.match(/.*\/files\/(.{36}).*/);
    var companyId = filesPath ? filesPath[1] : "";

    CoreClientService.getCompany(companyId).then(function(company) {
      $scope.company = company.item;
    }, function() {
      $scope.company = { name: "" };
    });
    
    $rootScope.$emit("storage-client:company-id-changed", companyId);
  }

  $scope.closeButtonClick = function() {
    gadgets.rpc.call("", "rscmd_closeSettings", null);
    window.parent.postMessage("close", "*");
  };
}]);
