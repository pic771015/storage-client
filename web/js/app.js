"use strict";
angular.module("medialibrary", [
  "common-config",
  "ui.router",
  "ui.bootstrap",
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
  $urlRouterProvider.otherwise("/files/local");
  $stateProvider
  .state("main", {
       url: "/files",
       templateUrl: "partials/main.html"
  })
  .state("main.local", {
       url: "/local",
       templateUrl: "partials/file-items.html"
  })
  .state("main.company-root", {
       url: "/:companyId",
       templateUrl: "partials/file-items.html"
  })
  .state("main.company-folders", {
       url: "/:companyId/*folderPath",
       templateUrl: "partials/file-items.html"
  });
}]);
