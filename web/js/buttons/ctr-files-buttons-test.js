"use strict";

/* global sinon */

describe("FilesButtonsController", function() {
  var FilesButtonsController, scope;
  var FileListService, DownloadService;
  var invokedMethod = "";
  beforeEach(module("risevision.storage.buttons.files"));

  beforeEach(module(function ($provide) {
    $provide.service("$modal", function() {
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

    $provide.service("GAPIRequestService", function() {
      var svc = {};
      svc.executeRequest = function(apiPath) {
        invokedMethod = apiPath;

        return {
          then: function() {
            return { code: 200, message: "" };
          }
        };
      };

      return svc;
    });
  }));

  beforeEach(inject(function ($controller, $rootScope, _$modal_, $injector, _FileListService_, _DownloadService_) {
    var $httpBackend = $injector.get("$httpBackend");
    $httpBackend.whenGET(/\.*/).respond(200, {});
    FileListService = _FileListService_;
    DownloadService = _DownloadService_;

    var modal = {};

    modal.open = function() {
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
    };

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

    FilesButtonsController = $controller("FilesButtonsController", {
      $scope: scope, $modal: modal, 
        FileListService: FileListService, DownloadService: DownloadService, $translate: $translate });
    }));

  it("should be defined", function() {
    expect(FilesButtonsController).to.exist;
  });

  it("should call storage.trash.move", function() {
    sinon.stub(scope, "isTrashFolder").returns(false);

    scope.trashButtonClick();
    scope.$apply();

    expect(invokedMethod).to.equal("storage.trash.move");
  });

  it("should call storage.trash.restore", function() {
    sinon.stub(scope, "isTrashFolder").returns(true);

    scope.restoreButtonClick();
    scope.$apply();

    expect(invokedMethod).to.equal("storage.trash.restore");
  });

  it("should call storage.files.delete", function() {
    sinon.stub(scope, "isTrashFolder").returns(true);

    scope.deleteButtonClick();
    scope.$apply();

    scope.modalInstance.close();
    scope.$apply();

    expect(invokedMethod).to.equal("storage.files.delete");
  });

  it("should call download service", function() {
    var stub = sinon.stub(DownloadService, "downloadFiles");
    
    scope.downloadButtonClick();
    scope.$apply();

    expect(stub.called).to.equal(true);
  });
});
