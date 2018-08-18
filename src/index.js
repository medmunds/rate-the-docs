import initWidget from "./widget";

function onDocumentReady(callback) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}

onDocumentReady(function() {
  initWidget(window.RATETHEDOCS_OPTIONS)
});
