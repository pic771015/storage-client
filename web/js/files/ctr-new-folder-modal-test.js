"use strict";

describe("NewFolderCtrl", function() {
  var NewFolderCtrl, scope;
  var invokedMethod = "";
  beforeEach(module("risevision.storage.files"));

  beforeEach(function() {
    module(function($provide) {
      $provide.service("GAPIRequestService", function() {
        return {
          executeRequest: function (apiPath) {
            invokedMethod = apiPath;

            return {
              then: function() {
                if(apiPath === "storage.files.get") {
                  return {code: 200, 
                    files: [{ "name": "test1", "size": 5 }, 
                        { "name": "test2", "size": 3 }]};
                }
                return { code: 200, message: "" };
              }
            };
          }
        };
      });

      $provide.service("$modalInstance", function() {
            return {
              result: {
                then: function(confirmCallback, cancelCallback) {
                  //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                  this.confirmCallBack = confirmCallback;
                  this.cancelCallback = cancelCallback;
                }
              },
              close: function( item ) {
                //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                this.result.confirmCallBack( item );
              },
              dismiss: function( type ) {
                //The user clicked cancel on the modal dialog, call the stored cancel callback
                this.result.cancelCallback( type );
              }
            };
      });
    });

    inject(function ($controller, $rootScope, _$modal_, $injector) {
      var $httpBackend = $injector.get("$httpBackend");
      $httpBackend.whenGET(/\.*/).respond(200, {});

      var $translate = function(key) {
        return {
        then: function(cb) {
          if(Array.isArray(key)) {
          var map = {};
          for(var i = 0; i < key.length; i++) {
            map[key[i]] = key[i];
          }
          cb(map);
          }
          else {
          cb(key);
          }
        }
        };
      };

      scope = $rootScope.$new();

      NewFolderCtrl = $controller("NewFolderCtrl", {
        $scope: scope, $translate: $translate });
    });
  });

  it("should be defined", function() {
    expect(NewFolderCtrl).to.exist;
  });

  it("should call storage.createFolder", function() {
    scope.folderName = "newFolder";
    scope.ok();
    scope.$apply();
  
    expect(invokedMethod).to.equal("storage.createFolder");
  });
});
