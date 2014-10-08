"use strict";

angular.module("storageFull")
.controller("FullScreenController", ["$scope", "userState", "usSpinnerService", function($scope, userState, usSpinnerService) {
  $scope.userState = userState;
  $scope.currentState = null;

  $scope.$watch(function () {
      return userState.isLoggedIn();
    }, function(loggedIn) {
    	if(loggedIn) {
    		usSpinnerService.spin("spn-stg-full");
    		$scope.currentState = "loggingIn";
    	}
    });

  $scope.$watch(function () {
      return userState.getSelectedCompanyId();
    }, 
    function (companyId) {
      if(companyId) {
        usSpinnerService.spin("spn-stg-full");
      	$scope.currentState = "loadingFiles";
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
    $scope.storageModal.src = "storage-modal.html#/files/" + companyId + "?storageFullscreen=true";
    $scope.storageModal.className = "storage-selector-iframe-full";
    $scope.storageModal.onload = function() {
    	$scope.findStorageListScope().$on("files-refreshed", function() {
          usSpinnerService.stop("spn-stg-full");
          $scope.currentState = null;
          $scope.$apply();
    	});
    };

    document.body.appendChild($scope.storageModal);
  };

  $scope.findStorageListScope = function() {
  	return document.getElementById("storage-modal-embedded").contentWindow.angular.element("#list").scope();
  };
}])
;
