"use strict";
angular.module("common-config", [])
    .value("GAPI_CLIENT_ID", "614513768474.apps.googleusercontent.com")
    .value("GAPI_SCOPES", "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
    .value("CORE_URL", "https://store-dot-rvacore-test.appspot.com/_ah/api")
    .value("STORAGE_URL", "http://localhost:8888/_ah/api")
    .value("MEDIA_LIBRARY_URL", "http://commondatastorage.googleapis.com/")
;
