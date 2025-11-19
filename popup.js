// Popup script for Zoetrope

const statusDiv = document.getElementById('status');
const statusText = document.getElementById('status-text');
const openSettingsButton = document.getElementById('open-settings');
const stopButton = document.getElementById('stop-button');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateStatus();

  openSettingsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  stopButton.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'STOP_ZOETROPE' });
    updateStatus();
  });
});

async function updateStatus() {
  const result = await chrome.storage.local.get(['isRunning']);

  if (result.isRunning) {
    statusDiv.className = 'status running';
    statusText.textContent = 'Zoetrope is running!';
    stopButton.style.display = 'block';
  } else {
    statusDiv.className = 'status stopped';
    statusText.textContent = 'Ready to start';
    stopButton.style.display = 'none';
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.isRunning) {
    updateStatus();
  }
});
