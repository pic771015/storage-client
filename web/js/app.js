"use strict";
angular.module("medialibrary", [
  "risevision.common.config",
  "ui.router",
  "ui.bootstrap",
  "medialibraryFilters", 
  "medialibraryServices",
  "gapi-auth",
  "cookieTester",
  "tagging",
  "localData",
  "gapi-file",
  "multi-download",
  "risevision.widget.common.subscription-status",
  "risevision.common.i18n"
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
       templateUrl: "partials/file-items.html",
        controller: function($state, $stateParams, FULLSCREEN) {
        if(FULLSCREEN){
          $(window.parent).on("hashchange", function () {
            if(window.parent.location.hash === "#/tagConfiguration") {
              $state.go("tagConfiguration", {companyId: $stateParams.companyId});
            }
            if(window.parent.location.hash === "#/") {
              $state.go("main.company-root", {folderPath: "/", companyId: $stateParams.companyId});
            }
          });
        }
      }
  })
  .state("main.company-folders", {
       url: "/:companyId/*folderPath",
       templateUrl: "partials/file-items.html"
  })
  .state("tagConfiguration", {
    url: "/tagConfiguration/:companyId",
    templateUrl: "partials/tagConfiguration.html"
  });
}])
.config(function($provide) {
  $provide.value("FULLSCREEN", (window.location.href.indexOf("storageFullscreen=true") > -1));
});
