"use strict";
describe("DeleteInstanceCtrl", function() {
    beforeEach(module("medialibrary"));

    var DeleteInstanceCtrl
        ,scope = {}
        ,modalInstance = {}
        ,confirmationMessage = "";

    beforeEach(inject(function($controller) {
        DeleteInstanceCtrl = $controller("DeleteInstanceCtrl"
            ,{$scope: scope, $modalInstance: modalInstance, confirmationMessage: confirmationMessage});
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

    it("should provide a confirmationsMessage variable ", function() {
        expect(scope.confirmationMessage).to.exist;
    });
});