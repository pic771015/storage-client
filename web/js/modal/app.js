"use strict";
angular.module("risevision.storage", [
  "risevision.common.config",
  "ui.router",
  "ui.bootstrap",
  "risevision.widget.common.subscription-status",
  "risevision.common.i18n",
  "risevision.storage.buttons.top",
  "risevision.storage.buttons.files",
  "risevision.storage.cookie",
  "risevision.storage.directives",
  "risevision.storage.download",
  "risevision.storage.filters",
  "risevision.storage.files",
  "risevision.storage.modal",
  "risevision.storage.publicread",
  "risevision.storage.services",
  "risevision.storage.subscription",
  "risevision.storage.tagging",
  "risevision.storage.throttle",
  "risevision.storage.upload"
]);

angular.module("risevision.storage")
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
        controller: ["$state", "$stateParams", "FULLSCREEN", function($state, $stateParams, FULLSCREEN) {
        if(FULLSCREEN){
          $(window.parent).on("hashchange", function () {
            if(window !== null) {
              var windowhash = window.parent.location.hash.substring(window.parent.location.hash.indexOf("?"), 0);
              windowhash = (windowhash === "") ? window.parent.location.hash : windowhash;
              if (windowhash === "#/tagConfiguration") {
                $state.go("tagConfiguration", {companyId: $stateParams.companyId});
              }
              if (windowhash === "#/") {
                $state.go("main.company-root", {folderPath: "/", companyId: $stateParams.companyId});
              }
            }
          });
        }
      }]
  })
  .state("main.company-folders", {
       url: "/:companyId/*folderPath",
       templateUrl: "partials/file-items.html"
  })
  .state("tagConfiguration", {
    url: "/tagConfiguration/:companyId",
    templateUrl: "partials/tag-configuration.html"
  });
}])
;

angular.module("risevision.common.config")
.config(["$provide", function($provide) {
  $provide.value("FULLSCREEN", (window.location.href.indexOf("modal.html") === -1));
}]);
