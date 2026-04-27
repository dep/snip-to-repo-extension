# Privacy Policy

_Last updated: 2026-04-27_

Synapse Web Clipper ("the extension") is a browser extension that saves the current web page as a Markdown file to a GitHub repository the user configures. This policy describes what data the extension handles and where it goes.

## Data the extension handles

The extension handles two categories of data:

### 1. Authentication information (GitHub personal access token)

When the user enters a GitHub personal access token (PAT) on the Options page, it is stored locally in the browser via the `storage` API (`chrome.storage.local` / `browser.storage.local`).

- The token never leaves the user's browser except to authenticate requests to `https://api.github.com`.
- The token is not transmitted to the extension author or to any third-party server.
- The token is stored unencrypted at rest, the same way other extension settings are stored. Users should scope their token narrowly (e.g. fine-grained PAT with **Contents: Read and write** on the specific repos they intend to use).

The user's repository configuration (owner, repo, branch, default folder, label) is stored alongside the token in the same local storage area, and is treated identically.

### 2. Website content (the page the user chooses to clip)

When the user clicks the toolbar icon and presses **Save as Markdown**, the extension reads the active tab's content, extracts the article using Mozilla Readability, and converts it to Markdown using Turndown.

- This only happens in response to that explicit user action, on the single tab the user is viewing.
- The extension does not read pages in the background, monitor browsing, or process tabs the user has not explicitly clipped.
- The resulting Markdown file is committed to the GitHub repository the user selected, using the GitHub Contents API and the user's PAT.

## Where data is sent

The extension makes network requests to exactly one destination:

- `https://api.github.com` — to read existing file metadata and commit the Markdown file to the user's chosen repository.

The extension does not contact any analytics, telemetry, advertising, error-reporting, or other third-party services. It does not have a backend operated by the author.

## What the extension does NOT collect

- No personally identifiable information (name, email, address, etc.)
- No health, financial, or payment information
- No personal communications
- No location data
- No web history (URLs visited, page titles outside of an explicit clip)
- No user activity (clicks, scroll, keystrokes, mouse position)
- No analytics or telemetry of any kind

## Sharing and transfer

The extension author does not receive, store, or have access to any user data. The only "transfer" of user data is the one the user themselves initiates: committing a clipped page to a GitHub repository they own and authenticated against with their own token.

User data is not sold or transferred to third parties. User data is not used for purposes unrelated to the extension's single purpose. User data is not used to determine creditworthiness or for lending purposes.

## Removing data

To remove all data the extension stores, uninstall the extension. This clears the local storage area used by the extension, including the token and repository configuration. To revoke GitHub access, delete the personal access token in your GitHub account settings.

## Contact

For questions about this policy, open an issue on the project repository.
