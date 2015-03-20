"use strict";
angular.module("risevision.storage.tagging")
.controller("FilterLookupCtrl", ["$scope", "TaggingService", "$modalInstance","available", "selected",
    function($scope, taggingSvc, $modalInstance, available, selected){
  taggingSvc.available.lookupTags = available;
  taggingSvc.selected.lookupTags = selected;
  $scope.availableLookupTags = taggingSvc.available.lookupTags;
  $scope.selectedLookupTags = taggingSvc.selected.lookupTags;
  $scope.addToSelectedLookupTag = function(tag){
    taggingSvc.addToSelectedLookupTag(tag);
  };
  $scope.removeFromSelectedLookupTag = function(tag){
    taggingSvc.removeFromSelectedLookupTag(tag);
  };

  $scope.applyFilter = function(){
    taggingSvc.filteredTags = angular.copy($scope.selectedLookupTags);
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss("cancel");
  };

  $scope.clearAllLookupTags = function(){
    taggingSvc.clearAllLookupTags();
  };

}])
;
