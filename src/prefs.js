"use strict";


export default function Prefs(appLabel) {
  let cache;

  try {
    cache = JSON.parse(localStorage.getItem(appLabel) || "{}");
  } catch (e) {
    cache = {};
  }

  function get(key) {
    return cache[key];
  }

  function set(key, value, flushUpdates=true) {
    cache[key] = value;
    if (flushUpdates) {
      flush();
    }
  }

  function clearAll(flushUpdates=true) {
    cache = {};
    if (flushUpdates) {
      flush();
    }
  }

  function flush() {
    localStorage.setItem(appLabel, JSON.stringify(cache));
  }

  return {
    get,
    set,
    clearAll,
    flush,
  };
}
