// Firefox MV3 supports async onMessage listeners that return a Promise.
browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.type !== 'commit') return;
  return handleCommit(msg);
});
