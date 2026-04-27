# Synapse Web Clipper

Firefox extension that saves the current page as Markdown to a GitHub repository via a personal access token.

## Install (temporary, for development)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select `manifest.json` in this directory

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

## Files

- `manifest.json` — MV3 manifest
- `popup.{html,js}` — toolbar popup (repo picker, filename, save)
- `options.{html,js}` — PAT + repo list config
- `content.js` — runs on the page, extracts + converts to Markdown
- `background.js` — handles GitHub API commit
- `lib/Readability.js`, `lib/turndown.js` — vendored libraries

## Security note

The PAT is stored in `browser.storage.local` (unencrypted at rest). Appropriate for personal use; don't use a token with scopes beyond what you need.
