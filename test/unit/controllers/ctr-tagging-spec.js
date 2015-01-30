"use strict";
describe("TaggingCtrl", function() {
  beforeEach(module("tagging"));

  var TaggingCtrl
    ,scope = {}
    ,modalInstance = {};
  beforeEach(inject(function($controller, _TaggingService_) {
    TaggingCtrl = $controller("TaggingCtrl"
      ,{$scope: scope
      , $modalInstance: modalInstance
      , TaggingService: _TaggingService_});
  }));

  it("should be defined", function() {
    expect(TaggingCtrl).to.exist;
  });

  it("should should provide a modal cancel function ", function() {
    expect(scope.cancel).to.exist;
  });

  it("should provide an modal ok function ", function() {
    expect(scope.ok).to.exist;
  });
  it("should should provide a resetView function ", function() {
    expect(scope.resetView).to.exist;
  });

  it("should should provide an editLookup function ", function() {
    expect(scope.editLookup).to.exist;
  });

  it("should should provide an editFreeform function ", function() {
    expect(scope.editFreeform).to.exist;
  });

  it("should should provide an refreshChanges function ", function() {
    expect(scope.refreshChanges).to.exist;
  });

  it("should should provide an clearAllLookupTags function ", function() {
    expect(scope.clearAllLookupTags).to.exist;
  });
  it("should should provide a addToSelectedLookupTag function ", function() {
    expect(scope.addToSelectedLookupTag).to.exist;
  });

  it("should should provide an removeFromSelectedLookupTag function ", function() {
    expect(scope.removeFromSelectedLookupTag).to.exist;
  });

  it("should should provide an saveChangesFromView function ", function() {
    expect(scope.saveChangesFromView).to.exist;
  });

});
