angular.module("cookieTester", [])
.service("cookieTester", ["$q", "$document", "$http", function($q, $document, $http) {
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

    $http.get("http://cookie-dot-storage-dot-rvacore-test.appspot.com/createThirdPartyCookie", {withCredentials: true})
    .then(function() {
      return $http.get("http://cookie-dot-storage-dot-rvacore-test.appspot.com/checkThirdPartyCookie", {withCredentials: true});
    })
    .then(function(resp) {
      if (resp.data.check === "true") {
        return defer.resolve(true);
      } else {
        return defer.reject(false);
      }
    })
    .then(null, function() {$q.reject("Cookie error");});

    return defer.promise;
  };

  return svc;
}]);
