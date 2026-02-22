// Popup script for controlling the extension

document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = document.getElementById('toggle');
  const statusText = document.getElementById('status');
  const countText = document.getElementById('count');
  const clearButton = document.getElementById('clearHistory');
  
  // Load current state
  const { isEnabled, visitedUrls = [] } = await chrome.storage.local.get(['isEnabled', 'visitedUrls']);
  
  toggleSwitch.checked = isEnabled;
  updateStatus(isEnabled);
  updateCount(visitedUrls.length);
  
  // Handle toggle changes
  toggleSwitch.addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await chrome.storage.local.set({ isEnabled: enabled });
    updateStatus(enabled);
  });
  
  // Handle clear history button
  clearButton.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all tracked websites?')) {
      await chrome.storage.local.set({ visitedUrls: [] });
      updateCount(0);
    }
  });
  
  // Update status text
  function updateStatus(enabled) {
    if (enabled) {
      statusText.textContent = 'Active';
      statusText.className = 'status active';
    } else {
      statusText.textContent = 'Inactive';
      statusText.className = 'status inactive';
    }
  }
  
  // Update count text
  function updateCount(count) {
    countText.textContent = `${count} website${count !== 1 ? 's' : ''} tracked`;
  }
  
  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      if (changes.visitedUrls) {
        updateCount(changes.visitedUrls.newValue.length);
      }
    }
  });
});
