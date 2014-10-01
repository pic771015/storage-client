"use strict";
describe("DeleteInstanceCtrl", function() {
    beforeEach(module("medialibrary"));

    var DeleteInstanceCtrl
        ,scope = {}
        ,modalInstance = {}
        ,confirmMessage = {};

    beforeEach(inject(function($controller) {
        DeleteInstanceCtrl = $controller("DeleteInstanceCtrl"
            ,{$scope: scope, $modalInstance: modalInstance, confirmMessage: confirmMessage});
    }));

    it("should be defined", function() {
        expect(DeleteInstanceCtrl).to.exist;
    });

    it("should should provide a modal cancel function ", function() {
        expect(scope.cancel).to.exist;
    });

    it("should provide an modal ok function ", function() {
        expect(scope.ok).to.exist;
    });
});