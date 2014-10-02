"use strict";
describe("NewFolderCtrl", function() {
    beforeEach(module("medialibrary"));

    var NewFolderCtrl
        ,scope = {}
        ,modalInstance = {};

    beforeEach(inject(function($controller) {
        NewFolderCtrl = $controller("NewFolderCtrl"
            ,{$scope: scope, $modalInstance: modalInstance});
    }));

    it("should be defined", function() {
        expect(NewFolderCtrl).to.exist;
    });

    it("should should provide a modal cancel function ", function() {
        expect(scope.cancel).to.exist;
    });

    it("should provide an modal ok function ", function() {
        expect(scope.ok).to.exist;
    });
});