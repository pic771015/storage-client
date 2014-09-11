"use strict";
angular.module("medialibrary", [
  "common-config",
  "ngRoute",
  "medialibraryFilters", 
  "medialibraryServices",
  "gapi-auth",
  "gapi-file",
  "angularFileUpload",
  "multi-download",
  "risevision.widget.common.subscription-status"
]);

angular.module("medialibrary")
.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/files/", {
       templateUrl: "partials/main.html",
    })
    .when("/files/:companyId", {
      templateUrl: "partials/main.html",
    })
    .when("/files/:companyId/folder/:folder", {
      templateUrl: "partials/main.html",
    })
    .otherwise({redirectTo: "/files/"});
}]);
