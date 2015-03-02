"use strict";

angular.module("storageFull", [
  "angularSpinner",
  "ui.router",
  "risevision.common.config",
  "risevision.common.header",
  "risevision.common.loading",
  "risevision.common.i18n"
]).config(["$urlRouterProvider", "$stateProvider",
  function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state("tagConfiguration", {
        url: "/tagConfiguration",
        templateUrl: "partials/tagConfiguration.html",
        resolve: {
            meta: ['$rootScope', '$stateParams', '$http', function ($rootScope, $stateParams, $http) {
                return $http.get('data/metatags.json').success (function(data) {
                    $rootScope.metatag = data["tagConfiguration"];
                });
            }]
        }
      })
      .state("storageMain", {
        url: "/",
        resolve: {
            meta: ['$rootScope', '$stateParams', '$http', function ($rootScope, $stateParams, $http) {
                return $http.get('data/metatags.json').success (function(data) {
                    $rootScope.metatag = data["storage"];
                });
            }]
        }
      });
  }]);