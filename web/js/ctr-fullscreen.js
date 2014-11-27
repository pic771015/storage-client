"use strict";

angular.module("storageFull")
.controller("FullScreenController", ["$scope", "$location", "$timeout", "userState", "usSpinnerService", function($scope, $location, $timeout, userState, usSpinnerService) {
  $scope.userState = userState;
  $scope.currentState = null;

  $scope.navOptions = [{
    title: "Platform",
    link: "http://rva.risevision.com/",
    target: "_blank"
  }];

  $scope.$on("risevision.user.signedOut", function () {
    // Redirect to root when the user signs out
    $location.path("/");
  });

  $scope.$watch(function () {
      return userState.isLoggedIn();
    }, function(loggedIn) {
      if(loggedIn) {
        usSpinnerService.spin("spn-stg-full");
        $scope.currentState = "loggingIn";

        // Avoid having all CH auth parameters visible
        $location.path("/");
      }
    });

  $scope.$watch(function () {
      return userState.getSelectedCompanyId();
    }, 
    function (companyId) {
      if(companyId) {
        usSpinnerService.stop("spn-stg-full");
        $scope.currentState = null;
        $scope.loadStorageModal(companyId);
      }
      else {
        $scope.clearStorageContainer();     
      }
    });

  $scope.clearStorageContainer = function() {
    if($scope.backDrop) {
        $scope.storageModal.parentNode.removeChild($scope.storageModal);
        $scope.backDrop.parentNode.removeChild($scope.backDrop);
    }
  };

  $scope.loadStorageModal = function(companyId) {
    $scope.clearStorageContainer();

    $scope.backDrop = document.createElement("div");
    document.body.appendChild($scope.backDrop);

    $scope.storageModal = document.createElement("iframe");
    $scope.storageModal.id = "storage-modal-embedded";
    $scope.storageModal.name = "storage-modal-embedded";
    $scope.storageModal.src = "storage-modal.html#/files/" + companyId + "?storageFullscreen=true";
    $scope.storageModal.className = "storage-selector-iframe-full";

    document.body.appendChild($scope.storageModal);
  };
}])
;
