// Minimal shim so `browser.*` works in Chrome. Firefox already exposes both.
// Chrome MV3 chrome.* APIs return Promises, matching the browser.* surface we use.
if (typeof globalThis.browser === 'undefined' && typeof globalThis.chrome !== 'undefined') {
  globalThis.browser = globalThis.chrome;
}
