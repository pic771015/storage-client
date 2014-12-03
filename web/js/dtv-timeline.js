"use strict";
angular.module("tagging")
.directive("ngTimelineString", function() {
  return {
    retrict: "A",
    templateUrl: "partials/tagging/timeline-string.html",
    scope: {
      ngModel: "="
    },
    controller: ["$scope", function($scope){
      $scope.optionsWeek = ["First", "Second", "Third", "Fourth", "Last"];
      $scope.optionsDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      $scope.optionsMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }],
    link: function() {
    }
  };
});