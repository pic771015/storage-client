"use strict";
describe("DeleteInstanceCtrl", function() {
    beforeEach(module("medialibrary"));

    var DeleteInstanceCtrl
        ,scope = {}
        ,modalInstance = {}
        ,confirmationMessages = {};

    beforeEach(inject(function($controller) {
        DeleteInstanceCtrl = $controller("DeleteInstanceCtrl"
            ,{$scope: scope, $modalInstance: modalInstance, confirmationMessages: confirmationMessages});
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

    it("should provide a confirmationsMessages variable ", function() {
        expect(scope.confirmationMessages).to.exist;
    });
});