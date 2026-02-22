# Deadupe - Chrome Extension

A Chrome browser extension that hides previously visited websites from Google search results.

## Features

- **Toggle On/Off**: Easily enable or disable the extension with a simple toggle switch
- **Automatic Tracking**: When enabled, tracks all websites you visit
- **Smart Filtering**: Hides visited sites from Google search results automatically
- **Privacy-Focused**: All data is stored locally in your browser
- **Clear History**: Option to clear all tracked websites

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked"
4. Select the `deadupe` folder
5. The extension icon should appear in your toolbar

## How to Use

1. Click the Deadupe extension icon in your Chrome toolbar
2. Toggle the switch to **ON** to activate the extension
3. Browse the web normally - the extension will track visited sites
4. When you search on Google, previously visited sites will be hidden from results
5. Toggle **OFF** to disable hiding (visited sites will reappear in search results)
6. Use "Clear History" to reset all tracked websites

## How It Works

1. **Tracking**: When enabled, the extension monitors your web navigation and stores the URLs you visit
2. **Filtering**: On Google search pages, the extension compares search result URLs with your visited URLs
3. **Hiding**: Matching results are hidden using CSS (`display: none`)
4. **Dynamic Updates**: Works with Google's dynamic content loading

## Technical Details

### Files

- `manifest.json` - Extension configuration
- `background.js` - Service worker that tracks visited URLs
- `content.js` - Script that runs on Google search pages to hide results
- `popup.html` - Extension popup interface
- `popup.js` - Popup logic and controls
- `popup.css` - Popup styling
- `icons/` - Extension icons

### Permissions

- `storage` - Store visited URLs and settings locally
- `tabs` - Monitor tab navigation
- `webNavigation` - Track when pages are visited
- `host_permissions` - Access all websites to track visits and modify search results

### Storage

All data is stored in `chrome.storage.local`:
- `isEnabled` (boolean) - Whether the extension is active
- `visitedUrls` (array) - List of normalized URLs you've visited

## Privacy

- All data is stored **locally** in your browser
- No data is sent to external servers
- You can clear your history at any time
- The extension only tracks when it's enabled

## Troubleshooting

**Extension not hiding results:**
- Make sure the toggle is ON
- Try refreshing the Google search page
- Check that you've actually visited the sites before

**Sites still appearing after visiting:**
- The extension only tracks visits when it's enabled
- Make sure you visited the full page (not just previewed it)

**Want to start fresh:**
- Click "Clear History" in the extension popup

## Development

To modify the extension:

1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Deadupe extension card
4. Test your changes

## Future Enhancements

Potential features for future versions:
- Export/import visited URLs
- Whitelist certain domains
- Statistics dashboard
- Sync across devices
- Support for other search engines (Bing, DuckDuckGo, etc.)

## License

This extension is provided as-is for personal use.
