'use strict';

/* Controllers */

function FileListCtrl($scope, $rootScope, $routeParams, $filter, MediaFiles) {

  $scope.mediaFiles = MediaFiles.query({companyId: $routeParams.companyId}, function(mediaFiles) {
//	  $scope.phonesGroupBy4 = $filter('groupBy')(phones, 4);  
  });

	initScope($scope, $rootScope);

}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];

function FileDetailCtrl($scope, $rootScope, $routeParams, MediaFile) {

  $scope.mediaFiles = MediaFile.query();

	initScope($scope, $rootScope);

}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];


function initScope($scope, $rootScope) {
  $scope.orderByAttribute = 'key';
  $scope.reverseSort = false;

	$scope.$watch('mediaFiles', function(items) {

		var checkedCount = 0;

		items.forEach(function(item) {
			if (item.checked) {
				checkedCount++;
			}
		});

		$rootScope.$broadcast('CheckedCountChange', checkedCount);		

	}, true);

	$scope.$watch('selectAll', function(v) {

    for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
        $scope.mediaFiles[ i ].checked = v;
    }

	});

	$rootScope.$on('FileSelectAction', function(event, file) {

		if (!file) {

		  for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
        if ($scope.mediaFiles[ i ].checked) {
					file = $scope.mediaFiles[ i ];
				}
			}
	
		}

		if (file) {
			alert(file.key + " selected!");
		}

	});

	$rootScope.$on('FileDeleteAction', function(event) {

		var selectedFiles = new Array();

		for ( var i = 0; i < $scope.mediaFiles.length; ++i ) {
			if ($scope.mediaFiles[ i ].checked) {
				selectedFiles.push($scope.mediaFiles[ i ]);
			}
		}
	
		alert(selectedFiles.length + " files selected for deletion!");

	});

}

function ButtonsController($scope, $rootScope) {

	$scope.selectDisabled = true;	
	$scope.downloadDisabled = true;
	$scope.deleteDisabled = true;	
	
	$rootScope.$on('CheckedCountChange', function(event, count)	 {

		$scope.selectDisabled = count != 1;
		$scope.downloadDisabled = !count;
		$scope.deleteDisabled = !count;

	});

}

function NavController($scope, $location) { 
  
	$scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
	};

}

function ViewController($scope) {
	//$scope.thumbnailView = false;	

	$('#view-toggle').bootstrapSwitch();

  $('#view-toggle').on('switch-change', function (e, data) {
		$scope.thumbnailView = data.value;
		
		if (data.value) {
			showThumbView();
		}
		else {
			showListView();
		}
	});
	
}

function showThumbView() {

	$('.media-thumb-image').show();

	$('.media-file-name').addClass('media-file-name-thumbnail');
	$('.media-file-type').addClass('media-file-type-thumbnail');
	$('.media-file-size').addClass('media-file-size-thumbnail');
	$('.media-date-modified').addClass('media-date-thumbnail');
	$('.media-check-box').addClass('media-check-thumbnail');

	$('.media-item').addClass('media-item-thumbnail');

	$('#column-headers').hide();

}

function showListView() {

	$('.media-thumb-image').hide();

	$('.media-file-name').removeClass('media-file-name-thumbnail');
	$('.media-file-type').removeClass('media-file-type-thumbnail');
	$('.media-file-size').removeClass('media-file-size-thumbnail');
	$('.media-date-modified').removeClass('media-date-thumbnail');
	$('.media-check-box').removeClass('media-check-thumbnail');

	$('.media-item').removeClass('media-item-thumbnail');

	$('#column-headers').show();

}



