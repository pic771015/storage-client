"use strict";
describe("i18n", function () {

  describe("translateStaticFilesLoader", function () {

    var $translate, $httpBackend, $translateStaticFilesLoader;

    beforeEach(module("medialibrary"));

    beforeEach(inject(function (_$translate_, _$httpBackend_, _$translateStaticFilesLoader_) {
      $httpBackend = _$httpBackend_;
      $translate = _$translate_;
      $translateStaticFilesLoader = _$translateStaticFilesLoader_;
    }));

    it("should be defined", function () {
      expect($translateStaticFilesLoader).to.exist;
    });
  });
});
