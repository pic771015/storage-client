"use strict";
angular.module("common-config", [])
    .value("GAPI_CLIENT_ID", "614513768474.apps.googleusercontent.com")
    .value("GAPI_SCOPES", "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
    .value("CORE_URL", "https://store-dot-rvacore-test.appspot.com/_ah/api")
    .value("COOKIE_CHECK_URL", "http://cookie-dot-storage-dot-rvacore-test.appspot.com")
    .value("STORAGE_URL", "http://localhost:8888/_ah/api")
    .value("MEDIA_LIBRARY_URL", "http://commondatastorage.googleapis.com/")
    .value("STORE_PRODUCT_CODE", "b0cba08a4baa0c62b8cdc621b6f6a124f89a03db")
    .value("STORE_PRODUCT_ID", "24")
;

angular.module("risevision.widget.common.subscription-status.config")
.value("STORE_SERVER_URL", "https://store-dot-rvacore-test.appspot.com/")
;
