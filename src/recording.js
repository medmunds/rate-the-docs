// Default API for recording user feedback (via Google Analytics events)

const READTHEDOCS_DATA = window.READTHEDOCS_DATA || {};


function recordEvent(action, label, value) {
  // ReadTheDocs initializes the Google Analytics trackerName "user"
  // with the project owner's GA trackingId
  const ga = window.ga || console.log; // if GA not loaded, just log (for local debugging)
  ga("user.send", "event", "RateTheDocs", action, label, value, {
    // (dimension order matches readthedocs-analytics.js, merely to avoid confusion)
    'dimension1': READTHEDOCS_DATA.project,
    'dimension2': READTHEDOCS_DATA.version
  });
}


export default {
  init() {
    // Return true if recording is available and can be used
    const googleAnalyticsLoaded = Boolean(window.ga);
    const isLocalhost = window.location.hostname === "localhost"; // local debugging w/o GA
    const navigator = window.navigator || {};
    const doNotTrack = (
      navigator.doNotTrack === "1" // Firefox, Chrome
      || navigator.msDoNotTrack === "1" // IE 9, 10
      || navigator.doNotTrack === "yes" // Gecko < 32
      || window.doNotTrack === "1"); // Safari, IE 11, Edge
    return !doNotTrack && (googleAnalyticsLoaded || isLocalhost);
  },

  recordUpVote() {
    recordEvent("Helpful Vote", "Yes", 1);
  },

  recordDownVote() {
    recordEvent("Helpful Vote", "No", 0);
  },

  recordSuggestion(suggestionText) {
    recordEvent("Suggestion", suggestionText);
  },
};
