import Prefs from "./prefs";
import recording from "./recording";

import widgetHtml from "./widget.html";
import "./widget.css";


const DEFAULT_OPTIONS = {
  // href for "contact us instead" link
  contactLink: "/contact",

  // Maximum length of GA event label (technically, 500 bytes, not chars).
  // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#el
  suggestionMaxLength: 500,

  // Data recording API
  recording: recording,
};


export default function initWidget(options={}) {
  if (!Object.assign) {
    // don't show widget if this browser is too old
    return false;
  }

  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (!options.recording.init()) {
    // don't show widget if there's no way to record the responses
    return false;
  }

  const prefs = Prefs("rate-the-docs");

  document.body.insertAdjacentHTML("beforeend", widgetHtml);
  const widget = document.body.querySelector(".ratd-widget");

  widget.querySelectorAll("a[href='#contact']")
    .forEach(contactEl => {contactEl.href = options.contactLink;});

  function switchToPanel(panelName) {
    const activePanel = widget.querySelector(`.ratd-panel-${panelName}`);
    widget.querySelectorAll(".ratd-panel").forEach(function(panel) {
      if (panel === activePanel) {
        panel.style.height = `${panel.scrollHeight}px`;
        panel.removeAttribute("aria-hidden");
      } else {
        panel.style.height = "0px";
        panel.setAttribute("aria-hidden", "true");
      }
    });
    if (panelName !== "rating") {
      enableToggleButton("close");
    }
  }

  //
  // Toggle button
  //

  function enableToggleButton(buttonName) {
    const enabledButton = widget.querySelector(`.ratd-toggle-${buttonName}`);
    widget.querySelectorAll(".ratd-toggle").forEach(function(button) {
      if (button === enabledButton) {
        button.disabled = false;
        button.removeAttribute("aria-hidden");
      } else {
        button.disabled = true;
        button.setAttribute("aria-hidden", "true")
      }
    });
  }

  function closeWidget() {
    widget.setAttribute("aria-hidden", "true");
    widget.addEventListener("transitionend", function(event) {
      if (event.currentTarget === widget) {
        widget.classList.remove("ratd-state-closing");
        widget.classList.add("ratd-state-closed");
      }
    });
    widget.classList.add("ratd-state-closing");
  }
  function collapseWidget() {
    widget.classList.add("ratd-state-collapsed");
    widget.querySelector(".ratd-panels").setAttribute("aria-hidden", "true");
    enableToggleButton("expand");
    prefs.set("collapsed", true);
  }
  function expandWidget() {
    widget.classList.remove("ratd-state-collapsed");
    widget.querySelector(".ratd-panels").removeAttribute("aria-hidden");
    enableToggleButton("collapse");
    prefs.set("collapsed", false);
  }

  widget.querySelector(".ratd-toggle-close").addEventListener("click", closeWidget);
  widget.querySelector(".ratd-toggle-collapse").addEventListener("click", collapseWidget);
  widget.querySelector(".ratd-toggle-expand").addEventListener("click", expandWidget);


  //
  // Rating panel
  //

  function handleRatingVote(event) {
    const rating = event.currentTarget.dataset["rating"];
    event.preventDefault();
    event.currentTarget.disabled = true;
    if (rating === "1") {
      options.recording.recordUpVote();
      switchToPanel("thanks");
    } else {
      options.recording.recordDownVote();
      switchToPanel("suggestion");
      suggestionTextarea.focus(); // ugh
    }
  }

  widget.querySelectorAll(".ratd-rating-vote")
    .forEach(voteButton => voteButton.addEventListener("click", handleRatingVote));


  //
  // Suggestion panel
  //

  const suggestionForm = widget.querySelector(".ratd-panel-suggestion");
  const suggestionTextarea = suggestionForm.querySelector("#ratd_suggestion_text");
  const suggestionSubmit = suggestionForm.querySelector("button[type=submit]");

  suggestionTextarea.maxLength = options.suggestionMaxLength;
  inputLengthCounter(suggestionTextarea,
    suggestionForm.querySelector(".ratd-suggestion-length"));

  function requireSuggestion() {
    const isEmpty = suggestionTextarea.value.trim().length < 1;
    suggestionSubmit.disabled = isEmpty;
  }
  suggestionTextarea.addEventListener("input", requireSuggestion);
  requireSuggestion();

  suggestionForm.addEventListener("submit", function(event) {
    event.preventDefault();
    suggestionSubmit.disabled = true;
    options.recording.recordSuggestion(suggestionTextarea.value.trim());
    switchToPanel("thanks");
  });


  // Initial state
  switchToPanel("rating");
  if (prefs.get("collapsed")) {
    collapseWidget();
  } else {
    expandWidget();
  }
  requestAnimationFrame(() => {
    widget.classList.remove("ratd-state-loading");
  });
}


function inputLengthCounter(input, lengthDisplay) {
  function updateLength() {
    // (should replace this with something aria-friendly)
    lengthDisplay.textContent = `${input.value.length}/${input.maxLength}`;
  }
  input.addEventListener("input", updateLength);
  updateLength(); // init
}
