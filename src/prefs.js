// Simple persistent preferences API (using localStorage)

export default function Prefs(appLabel) {
  let cache;

  try {
    cache = JSON.parse(localStorage.getItem(appLabel)) || {};
  } catch (e) {
    cache = {};
  }

  function flush() {
    localStorage.setItem(appLabel, JSON.stringify(cache));
  }

  return {
    get(key) {
      return cache[key];
    },

    set(key, value, flushUpdates=true) {
      cache[key] = value;
      if (flushUpdates) {
        flush();
      }
    },

    clearAll(flushUpdates=true) {
      cache = {};
      if (flushUpdates) {
        flush();
      }
    },

    flush,
  };
}
