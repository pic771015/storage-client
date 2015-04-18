"use strict";

window.addEventListener("message", function (event) {
  if (Array.isArray(event.data)) {
    document.querySelector("iframe").remove();
  } else if (typeof event.data === "string") {
    if (event.data === "close") {
      document.querySelector("iframe").remove();
    }
  }
});
