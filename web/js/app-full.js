"use strict";

angular.module("medialibrary", [
  "angularSpinner",
  "ui.router",
  "ui.router.util",
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
  "risevision.common.config",
  "risevision.common.header",
  "risevision.common.loading",
  "risevision.common.i18n"
]);

angular.module("medialibrary")
.config(["$compileProvider", function($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);
}])
.config(["$provide", function($provide) {
  $provide.value("FULLSCREEN", (window.location.href.indexOf("modal") === -1));
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
  if(window.location.href.indexOf("modal") === -1) {
    $locationProvider.html5Mode({
      enabled: true
    });
  }

  if(window.location.href.indexOf("/files") === -1) {
    $urlRouterProvider.otherwise("/");
  }

  $stateProvider
  .state("initial", {
      url: "/",
      template: "<div ui-view></div>",
      resolve: {
          meta: ["$rootScope", "$stateParams", "$http", function ($rootScope, $stateParams, $http) {
              return $http.get("data/metatags.json").success (function(data) {
                  $rootScope.metatag = data.storage;
              });
          }]
      }
  })
  .state("main", {
    url: "/files",
    templateUrl: "partials/main.html",
    resolve: {
        meta: ["$rootScope", "$stateParams", "$http", function ($rootScope, $stateParams, $http) {
            return $http.get("data/metatags.json").success (function(data) {
                $rootScope.metatag = data.storage;
            });
        }]
    }
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
    templateUrl: "partials/tagConfiguration.html",
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
