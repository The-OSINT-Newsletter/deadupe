// Background service worker for tracking visited websites

// Initialize storage with default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isEnabled: false,
    visitedUrls: []
  });
});

// Listen for navigation events to track visited websites
chrome.webNavigation.onCompleted.addListener(async (details) => {
  // Only track main frame (not iframes)
  if (details.frameId !== 0) return;
  
  // Get current settings
  const { isEnabled, visitedUrls = [] } = await chrome.storage.local.get(['isEnabled', 'visitedUrls']);
  
  // Only track if extension is enabled
  if (!isEnabled) return;
  
  try {
    const url = new URL(details.url);
    
    // Don't track Google search pages or chrome:// pages
    if (url.hostname.includes('google.com') && url.pathname.includes('/search')) return;
    if (url.protocol === 'chrome:' || url.protocol === 'chrome-extension:') return;
    
    // Normalize the URL (remove protocol and www)
    const normalizedUrl = normalizeUrl(url.hostname + url.pathname);
    
    // Add to visited URLs if not already present
    if (!visitedUrls.includes(normalizedUrl)) {
      visitedUrls.push(normalizedUrl);
      await chrome.storage.local.set({ visitedUrls });
      console.log('Tracked visit:', normalizedUrl);
    }
  } catch (error) {
    console.error('Error tracking URL:', error);
  }
});

// Helper function to normalize URLs for comparison
function normalizeUrl(url) {
  // Remove www. prefix
  url = url.replace(/^www\./, '');
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  return url.toLowerCase();
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVisitedUrls') {
    chrome.storage.local.get(['visitedUrls'], (result) => {
      sendResponse({ visitedUrls: result.visitedUrls || [] });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'clearHistory') {
    chrome.storage.local.set({ visitedUrls: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
