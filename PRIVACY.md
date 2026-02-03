# Privacy Policy for SF Neighborhood New Tab

**Last Updated:** February 2025

## Overview

SF Neighborhood New Tab is a Chrome extension that replaces your new tab page with an interactive San Francisco neighborhood map. This privacy policy explains how the extension handles your data.

## Data Collection

### What We Collect

This extension collects and stores the following data **locally on your device**:

- **Shortcuts**: URLs and names you add for quick access
- **Settings**: Your preferences for map type, mode (standard/quiz), and theme
- **Quiz History**: Your quiz answers from the past 7 days (for accuracy tracking)

### What We Do NOT Collect

- No personal information (name, email, etc.)
- No browsing history
- No analytics or tracking data
- No data is transmitted to external servers owned by the developer

## Data Storage

All data is stored using Chrome's built-in storage APIs:

- **chrome.storage.sync**: Settings and shortcuts (synced across your Chrome browsers if you're signed in to Chrome)
- **chrome.storage.local**: Quiz history (stored locally only)

You can clear this data at any time by removing the extension.

## Third-Party Services

The extension uses one external service:

- **Google Favicon Service** (`https://www.google.com/s2/favicons`): Used to fetch website icons for your shortcuts. Only the domain name of your shortcut URLs is sent to this service.

## Permissions

The extension requests the following permissions:

- **storage**: To save your settings and shortcuts
- **tabs**: To open multiple URLs when using multi-URL shortcuts

## Data Sharing

We do not sell, trade, or transfer your data to any third parties. The only external request made is to Google's favicon service as described above.

## Changes to This Policy

If we make changes to this privacy policy, we will update the "Last Updated" date above.

## Contact

If you have questions about this privacy policy, please open an issue on our GitHub repository:
https://github.com/ryanjm/SFNewTab

## Open Source

This extension is open source. You can review the complete source code at:
https://github.com/ryanjm/SFNewTab
