// Content script that runs on Google search pages

// Function to normalize URLs for comparison
function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    let normalized = urlObj.hostname + urlObj.pathname;
    // Remove www. prefix
    normalized = normalized.replace(/^www\./, '');
    // Remove trailing slash
    normalized = normalized.replace(/\/$/, '');
    return normalized.toLowerCase();
  } catch (error) {
    return null;
  }
}

// Function to find all search result links on the page
function findSearchResultLinks() {
  const links = [];
  
  // Try multiple selectors for search results
  // Modern Google uses various container structures
  const containers = document.querySelectorAll('#search a, #rso a, .g a, div[data-sokoban-container] a');
  
  containers.forEach(link => {
    if (!link.href) return;
    
    // Filter out Google's internal links and tracking
    const url = link.href;
    if (url.includes('google.com/search') || 
        url.includes('google.com/url') ||
        url.includes('accounts.google.com') ||
        url.startsWith('javascript:') ||
        url.startsWith('#')) {
      return;
    }
    
    // Find the parent container to hide
    let container = link.closest('div.g') || 
                    link.closest('div[data-sokoban-container]') ||
                    link.closest('div.Gx5Zad');
    
    // If we can't find a specific container, try to find a reasonable parent
    if (!container) {
      let parent = link.parentElement;
      for (let i = 0; i < 5 && parent; i++) {
        if (parent.tagName === 'DIV' && parent.querySelector('h3')) {
          container = parent;
          break;
        }
        parent = parent.parentElement;
      }
    }
    
    if (container && !links.find(l => l.container === container)) {
      links.push({ url: link.href, container });
    }
  });
  
  return links;
}

// Function to hide visited search results
async function hideVisitedResults() {
  // Get current settings
  const { isEnabled, visitedUrls = [] } = await chrome.storage.local.get(['isEnabled', 'visitedUrls']);
  
  console.log('Deadupe: isEnabled =', isEnabled, 'visitedUrls count =', visitedUrls.length);
  
  if (!isEnabled) {
    // If disabled, show all results
    showAllResults();
    return;
  }
  
  // Find all search result links
  const searchLinks = findSearchResultLinks();
  
  console.log('Deadupe: Found', searchLinks.length, 'search result links');
  
  let hiddenCount = 0;
  
  searchLinks.forEach(({ url, container }) => {
    const normalizedUrl = normalizeUrl(url);
    
    if (normalizedUrl && visitedUrls.includes(normalizedUrl)) {
      // Hide the result
      container.style.display = 'none';
      container.setAttribute('data-deadupe-hidden', 'true');
      hiddenCount++;
      console.log('Deadupe: Hiding', normalizedUrl);
    } else {
      // Make sure it's visible
      if (container.hasAttribute('data-deadupe-hidden')) {
        container.style.display = '';
        container.removeAttribute('data-deadupe-hidden');
      }
    }
  });
  
  console.log(`Deadupe: Hid ${hiddenCount} previously visited result(s)`);
}

// Function to show all results (when extension is disabled)
function showAllResults() {
  const hiddenResults = document.querySelectorAll('[data-deadupe-hidden]');
  hiddenResults.forEach((result) => {
    result.style.display = '';
    result.removeAttribute('data-deadupe-hidden');
  });
}

// Run when page loads
hideVisitedResults();

// Watch for dynamic content changes (Google loads results dynamically)
const observer = new MutationObserver(() => {
  hideVisitedResults();
});

// Observe the search results container
const searchContainer = document.querySelector('#search, #rso');
if (searchContainer) {
  observer.observe(searchContainer, {
    childList: true,
    subtree: true
  });
}

// Listen for storage changes (when extension is toggled or URLs are cleared)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    if (changes.isEnabled || changes.visitedUrls) {
      hideVisitedResults();
    }
  }
});
