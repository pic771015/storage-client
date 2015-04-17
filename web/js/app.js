"use strict";

angular.module("risevision.storage", [
  "ui.router",
  "ui.bootstrap",
  "risevision.widget.common.subscription-status",
  "risevision.storage.modal",
  "risevision.common.config",
  "risevision.common.header",
  "risevision.common.loading",
  "risevision.common.i18n",
  "risevision.storage.buttons.top",
  "risevision.storage.buttons.files",
  "risevision.storage.cookie",
  "risevision.storage.directives",
  "risevision.storage.download",
  "risevision.storage.filters",
  "risevision.storage.files",
  "risevision.storage.fullscreen",
  "risevision.storage.publicread",
  "risevision.storage.services",
  "risevision.storage.subscription",
  "risevision.storage.tagging",
  "risevision.storage.throttle",
  "risevision.storage.upload"
]);

angular.module("risevision.storage")
.config(["$compileProvider", function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
}])
.config(["$urlMatcherFactoryProvider", function($urlMatcherFactoryProvider) {
  $urlMatcherFactoryProvider.type("NotEncodedURL", {
    encode: function valToString(val) { return val !== null ? val.toString() : val; },
    decode: function valFromString(val) { return val !== null ? val.toString() : val; },
    is: angular.isString,
    pattern: /\/.*/
  });
}])
.config(["$urlRouterProvider", "$stateProvider", "$locationProvider",
function($urlRouterProvider, $stateProvider, $locationProvider) {
  if(window.location.href.indexOf("modal.html") === -1) {
    $locationProvider.html5Mode({
      enabled: true
    });
  }

  if(window.location.href.indexOf("/files") === -1) {
    $urlRouterProvider.otherwise("/");
  }

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
    url: "/:companyId/{folderPath:NotEncodedURL}",
    templateUrl: "partials/file-items.html"
  })
  .state("tagConfiguration", {
    url: "/tagConfiguration/:companyId",
    templateUrl: "partials/tag-configuration.html",
    resolve: {
        meta: ["$rootScope", "$stateParams", "$http", function ($rootScope, $stateParams, $http) {
            return $http.get("data/metatags.json").success (function(data) {
                $rootScope.metatag = data.tagConfiguration;
            });
        }]
    }
  });
}])
;

angular.module("risevision.common.config")
.config(["$provide", function($provide) {
  $provide.value("FULLSCREEN", (window === window.top));
}]);
