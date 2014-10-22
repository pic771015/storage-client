angular.module("cookieTester", [])
.service("cookieTester", ["$q", "$document", "$http", "COOKIE_CHECK_URL", function($q, $document, $http, COOKIE_CHECK_URL) {
  var svc = {}

  svc.status = {message: "Checking local and third party cookies",
                passed: undefined};

  svc.checkCookies = function() {
    return $q.all([svc.checkLocalCookiePermission()
                  ,svc.checkThirdPartyCookiePermission()])
           .then(function() {
             svc.status.message = "Cookie enablement verified";
             svc.status.passed = true;
           }, function() {
             svc.status.passed = false;
             svc.status.message = "Please enable cookies " +
                                  "(including third party cookies)";
             return $q.reject(false);
           });
  };

  svc.checkLocalCookiePermission = function() {
    $document[0].cookie = "rv-test-local-cookie=yes";
    if ($document[0].cookie.indexOf("rv-test-local-cookie") > -1) {
      return $q.when(true);
    }

    return $q.reject(false);
  };

  svc.checkThirdPartyCookiePermission = function() {
    var defer = $q.defer();

    $http.get(COOKIE_CHECK_URL + "/createThirdPartyCookie", {withCredentials: true})
    .then(function() {
      return $http.get(COOKIE_CHECK_URL + "/checkThirdPartyCookie", {withCredentials: true});
    }, function(){
		    console.log("create third party Cookie get request failed.");
	    })
    .then(function(resp) {
      if (resp.data.check === "true") {
        return defer.resolve(true);
      } else {
        return defer.reject(false);
      }
    }, function(){
		    console.log("check third party Cookie get request failed.");
	    })
    .then(null, function() {defer.reject(false);});

    return defer.promise;
  };

  return svc;
}]);
