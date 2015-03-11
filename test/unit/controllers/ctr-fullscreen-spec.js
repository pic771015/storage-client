describe("FullScreenController", function() {
    "use strict";

    beforeEach(module("medialibrary"));

    var FullScreenController, scope; //, userState, usSpinnerService;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();

        FullScreenController = $controller("FullScreenController"
            ,{ $scope: scope, userState: {}, usSpinnerService: {} });
    }));

    it("should be defined", function() {
        expect(FullScreenController).to.exist;
    });
});
