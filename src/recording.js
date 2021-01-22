// Default API for recording user feedback (via Google Analytics events)

const READTHEDOCS_DATA = window.READTHEDOCS_DATA || {};


function recordEvent(action, label, value) {
  // global gtag;
  // global ga;
  const isLocalhost = window.location.hostname === "localhost";
  const category = "RateTheDocs";
  if (typeof gtag === "function") {
    // ReadTheDocs initializes READTHEDOCS_DATA.user_analytics_code
    // with the project owner's GA trackingId
    gtag("event", action, {
      'send_to': READTHEDOCS_DATA.user_analytics_code,
      'event_category': category,
      'event_label': label,
      'value': value,
      'dimension1': READTHEDOCS_DATA.project,
      'dimension2': READTHEDOCS_DATA.version
    });
  } else if (typeof ga === "function") {
    // ReadTheDocs initializes the Google Analytics trackerName "user"
    // with the project owner's GA trackingId
    ga("user.send", "event", category, action, label, value, {
      // (dimension order matches readthedocs-analytics.js, merely to avoid confusion)
      'dimension1': READTHEDOCS_DATA.project,
      'dimension2': READTHEDOCS_DATA.version
    });
  } else if (isLocalhost) {
    // Local debugging without GA
    console.log("recordEvent", category, action, label, value);
  } else {
    // Either attempt to submit feedback before GA loads (unlikely),
    // or user is blocking GA but has not enabled doNotTrack.
    alert("Unable to register your docs feedback: Google Analytics not loaded");
  }
}


export default {
  init() {
    // Return true if recording is available and can be used.
    // (Google Analytics loads async, and the ReadTheDocs code that kicks
    // it off is also loaded async—readthedocs-analytics.js—so just assume
    // it will become available later unless the user has enabled doNotTrack.)
    const navigator = window.navigator || {};
    const doNotTrack = (
      navigator.doNotTrack === "1" // Firefox, Chrome
      || navigator.msDoNotTrack === "1" // IE 9, 10
      || navigator.doNotTrack === "yes" // Gecko < 32
      || window.doNotTrack === "1"); // Safari, IE 11, Edge
    return !doNotTrack;
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
