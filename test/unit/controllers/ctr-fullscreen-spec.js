describe("FullScreenController", function() {
    "use strict";

    beforeEach(module("storageFull"));

    var FullScreenController, scope; //, userState, usSpinnerService;

    beforeEach(inject(function($rootScope, $controller, usSpinnerService) {
        scope = $rootScope.$new();

        FullScreenController = $controller("FullScreenController"
            ,{ $scope: scope, userState: {}, usSpinnerService: usSpinnerService });
    }));

    it("should be defined", function() {
        expect(FullScreenController).to.exist;
    });

    it("should provide a clearStorageContainer function ", function() {
        expect(scope.clearStorageContainer).to.exist;
    });

    it("should should provide a loadStorageModal function ", function() {
        expect(scope.loadStorageModal).to.exist;
    });
});
