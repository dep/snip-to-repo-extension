// Chrome MV3 service worker. Pull in shared commit logic.
importScripts('background-core.js');

// Chrome's onMessage doesn't await async listeners — return true to keep the
// channel open and respond via sendResponse.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== 'commit') return;
  handleCommit(msg).then(sendResponse);
  return true;
});
