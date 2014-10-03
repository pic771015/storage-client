"use strict";
describe("cookieTesterController", function() {
	beforeEach(module("cookieTester"));

	var cookieTesterController
		,cookieTester = {};

	beforeEach(inject(function($controller) {
		cookieTesterController = $controller("cookieTesterController"
			,{cookieTester: cookieTester});
	}));

	it("should be defined", function() {
		expect(cookieTesterController).to.exist;
	});
});