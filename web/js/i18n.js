"use strict";
angular.module("risevision.widget.common.translate", ["pascalprecht.translate"])
.config(["$translateProvider", function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: "locales/",
    suffix: "/translation.json"
  });
  $translateProvider.determinePreferredLanguage();
  if($translateProvider.preferredLanguage().indexOf("en_") === 0){
    $translateProvider.preferredLanguage("en");
  }
}]);
