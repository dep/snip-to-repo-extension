# Synapse Web Clipper

Browser extension (Firefox + Chrome, Manifest V3) that saves the current page as Markdown to a GitHub repository via a personal access token.

## Layout

    shared/      Code identical across browsers (popup, options, content script, libs, icons, GitHub commit core)
    firefox/    Firefox-specific manifest + background entry (background.scripts + gecko settings)
    chrome/     Chrome-specific manifest + background entry (service worker)
    build.sh    Combines shared/ with each browser dir into dist/<browser>/

## Build

    ./build.sh

Outputs `dist/chrome/` and `dist/firefox/`, each a self-contained unpacked extension.

## Load unpacked

### Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select `dist/chrome`

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `dist/firefox/manifest.json`

## Setup

1. Create a GitHub PAT:
   - Classic: scope `repo`
   - Fine-grained: repository access + **Contents: Read and write**
2. Open the extension's Options page.
3. Paste the token.
4. Add one or more repositories (owner, repo, branch, default folder).
5. Save.

## Usage

Click the toolbar icon on any page:

- Pick a repo from the dropdown
- Adjust folder and filename if desired
- Click **Save as Markdown**

The page is extracted with Mozilla Readability, converted to Markdown with Turndown, and committed via the GitHub Contents API. Existing files at the same path are updated (new commit with the prior `sha`).

## How the cross-browser code works

- `shared/lib/browser-shim.js` aliases `chrome` to `browser` so popup/options/content code can use a single API surface. Loaded first in `popup.html` and `options.html`.
- `shared/background-core.js` holds the GitHub commit logic. Each browser's `background.js` registers the message listener using its native pattern:
  - Firefox: async listener returning a Promise.
  - Chrome: listener returns `true` and replies via `sendResponse` (service worker constraint).

## Files

- `shared/popup.{html,js}` — toolbar popup (repo picker, filename, save)
- `shared/options.{html,js}` — PAT + repo list config
- `shared/content.js` — runs on the page, extracts + converts to Markdown
- `shared/background-core.js` — GitHub commit logic shared by both browsers
- `shared/lib/Readability.js`, `shared/lib/turndown.js` — vendored libraries
- `shared/lib/browser-shim.js` — chrome → browser alias
- `firefox/`, `chrome/` — per-browser `manifest.json` and `background.js`

## Security note

The PAT is stored in `browser.storage.local` (unencrypted at rest). Appropriate for personal use; don't use a token with scopes beyond what you need.

## Privacy

See [PRIVACY.md](PRIVACY.md) for the full privacy policy.
