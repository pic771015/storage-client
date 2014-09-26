"use strict";
angular.module("medialibrary", [
  "common-config",
  "ui.router",
  "medialibraryFilters", 
  "medialibraryServices",
  "gapi-auth",
  "gapi-file",
  "angularFileUpload",
  "multi-download",
  "risevision.widget.common.subscription-status"
]);

angular.module("medialibrary")
.config(["$urlRouterProvider", "$stateProvider",
function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise("/files");
  $stateProvider
  .state("rootFilesList", {
       url: "/files/:companyId",
       templateUrl: "partials/main.html",
  })
  .state("folderFilesList", {
       url: "/files/:companyId/*folderPath",
       templateUrl: "partials/main.html",
  })
  .state("localFilesList", {
       url: "/files",
       templateUrl: "partials/main.html",
  });
}]);
