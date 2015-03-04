"use strict";

angular.module("risevision.storage.common", ["angularSpinner"])
.service("SpinnerService", ["$timeout", "usSpinnerService", function($timeout, usSpinnerService) {
  var spinnerName = "spn-storage-main";
  var taskCount = 0;
  var startTimeout = null;
  var svc = {};

  svc.start = function() {
    taskCount++;

    // Wait a few milliseconds to start the spinner to avoid showing it for short tasks.
    // If a previous timer exists, only keep that one active.
    if(!startTimeout) {
      startTimeout = $timeout(function() {
        startTimeout = null;

        if(taskCount > 0) {
          usSpinnerService.spin(spinnerName);
        }
      }, 1000);
    }
  };

  svc.stop = function() {
    taskCount--;
    if(taskCount === 0) {
      usSpinnerService.stop(spinnerName);
    }
  };

  return svc;
}]);
