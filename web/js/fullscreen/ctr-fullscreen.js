/*jshint scripturl:true*/

"use strict";

var displayStorageMain = function() {};
var displayTagConfigurationMain = function() {};

angular.module("risevision.storage.fullscreen", ["risevision.storage.common"])
.controller("FullScreenController", ["$scope", "$rootScope", "$http", "$location", "$timeout", "userState", "$state", "SpinnerService",
    function($scope, $rootScope, $http, $location, $timeout, userState, $state, spinnerSvc) {
  $scope.userState = userState;
  $scope.navOptions = [{
    title: "Platform",
    link: "http://rva.risevision.com/",
    target: "_blank"
  }, {
    title: "Help",
    link: "http://help.risevision.com/#/user/storage/what-is-storage",
    target: "_blank"
  }];

  $http.get("data/metatags.json").success (function(data) {
    $rootScope.metatag = data.storage;
  });

  $scope.$on("risevision.user.authorized", function () {
    if(!$scope.userSignedIn) {
      spinnerSvc.start();
    }

    $scope.userSignedIn = true;

  });

  $scope.$on("risevision.user.signedOut", function () {
    $scope.userSignedIn = false;

    // Redirect to root when the user signs out
    $location.path("/");
  });

  $scope.$watch(function () {
      return userState.getSelectedCompanyId();
    }, 
    function (companyId) {
      if(companyId) {
        $scope.navOptions = [{
          title: "Platform",
          link: "http://rva.risevision.com/",
          target: "_blank"
        }, {
          title: "Storage",
          link: "javascript:displayStorageMain();",
          target: "_self"
        }, {
          title: "Tag Settings",
          link: "javascript:displayTagConfigurationMain();",
          target: "_self"
        }, {
          title: "Help",
          link: "http://help.risevision.com/#/user/storage/what-is-storage",
          target: "_blank"
        }];

        displayStorageMain = function() {
          $state.go("main.company-folders", { folderPath: "", companyId: companyId });
        };

        displayTagConfigurationMain = function() {
          $state.go("tagConfiguration", { companyId: companyId });
        };

        var loc = window.location.href;
        var filesPath = loc.match(/.*\/files\/.{36}\/(.*)/);

        filesPath = filesPath ? filesPath[1] : "";

        if(filesPath.indexOf("cid=") >= 0) {
          $state.go("main.company-root", { companyId: companyId });
        }
        else {
          $state.go("main.company-folders", { folderPath: filesPath, companyId: companyId });
        }
        
        $rootScope.$emit("storage-client:company-id-changed", companyId);
        spinnerSvc.stop();
      }
    });
}])
;
