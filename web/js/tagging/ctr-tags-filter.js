"use strict";
angular.module("risevision.storage.tagging")
.controller("TagsFilterCtrl", ["$scope", "TaggingService", "FileListService", "$modal",
    function($scope, taggingSvc, listSvc, $modal) {
  $scope.displayFilters = false;
  $scope.isCollapsed = true;
  $scope.selectedTags = [];
  $scope.filteredTags = taggingSvc.filteredTags;

  $scope.openModal = function(){
      taggingSvc.refreshConfigTags();
    $scope.showLookupEditView = true;
      var availableTags = taggingSvc.getAvailableLookupTags(taggingSvc.configTags.lookupTags, $scope.selectedTags);
      var modalInstance = $modal.open({

        templateUrl: "partials/tagging/filter-modal.html",
        controller: "FilterLookupCtrl",
        resolve:  {
          available: function(){
            return availableTags;
          },
          selected: function(){
            return $scope.selectedTags;
          }
        }
      });

      modalInstance.result.then(function(){
        //do what you need if user presses ok
        $scope.filteredTags = taggingSvc.filteredTags;
      }, function (){
        // do what you need to do if user cancels
      });
  };

  $scope.toggleDialog = function() {
    $scope.displayFilters = !$scope.displayFilters;
  };

  $scope.filterDate = function(date, type){

    if(type === "start"){
      taggingSvc.filterStartDate = date;
    }
    if(type === "end"){
      taggingSvc.filterEndDate = date;
    }
  };

  $scope.filterStartDate = null;
  $scope.filterEndDate = null;
  $scope.openDatePicker = function($event,opened) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope[opened] = true;
  };

  $scope.dateOptions = {
    formatYear: "yy",
    formatMonth: "MMM",
    startingDay: 1,
    showWeeks:"false"
  };

  $scope.dateFormat = "dd-MMM-yyyy";

  $scope.hstep = 1;
  $scope.mstep = 15;


  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };
}])
;
