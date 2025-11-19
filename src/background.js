// Background service worker for Zoetrope Chrome Extension

let zoetropeState = {
  isRunning: false,
  frames: [],
  framerate: 24,
  windowId: null,
  tabIds: [],
  currentFrameIndex: 0,
  intervalId: null,
  currentBatchStart: 0
};

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_ZOETROPE':
      handleStartZoetrope(message.frames, message.framerate)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep channel open for async response

    case 'STOP_ZOETROPE':
      handleStopZoetrope()
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;

    case 'GET_FRAME':
      const frameData = zoetropeState.frames[message.frameIndex];
      sendResponse({ frameData });
      return false;

    case 'GET_STATE':
      sendResponse({ isRunning: zoetropeState.isRunning });
      return false;
  }
});

async function handleStartZoetrope(frames, framerate) {
  console.log(`Starting Zoetrope with ${frames.length} frames at ${framerate} fps`);

  // Stop any existing zoetrope
  if (zoetropeState.isRunning) {
    await handleStopZoetrope();
  }

  // Store frames and settings
  zoetropeState.frames = frames;
  zoetropeState.framerate = framerate;
  zoetropeState.isRunning = true;
  zoetropeState.currentFrameIndex = 0;
  zoetropeState.currentBatchStart = 0;

  // Save state to storage
  await chrome.storage.local.set({ isRunning: true });

  // Create window with tabs
  await createZoetropeWindow();

  // Start cycling through tabs
  startTabCycling();
}

async function createZoetropeWindow() {
  const tabCount = zoetropeState.framerate;
  const extensionUrl = chrome.runtime.getURL('frame.html');

  // Create a new window
  const window = await chrome.windows.create({
    url: `${extensionUrl}?frame=0`,
    type: 'normal',
    focused: true
  });

  zoetropeState.windowId = window.id;
  zoetropeState.tabIds = [window.tabs[0].id];

  // Create additional tabs in parallel for better performance
  const tabPromises = [];
  for (let i = 1; i < tabCount; i++) {
    tabPromises.push(
      chrome.tabs.create({
        windowId: window.id,
        url: `${extensionUrl}?frame=${i}`,
        active: false
      })
    );
  }

  const tabs = await Promise.all(tabPromises);
  zoetropeState.tabIds.push(...tabs.map(tab => tab.id));

  console.log(`Created window with ${tabCount} tabs`);

  // Give tabs a moment to load before starting animation
  await new Promise(resolve => setTimeout(resolve, 500));
}

function startTabCycling() {
  // Calculate interval based on framerate
  // For smooth animation, we cycle through all tabs at the specified framerate
  const intervalMs = 1000 / zoetropeState.framerate;

  let currentTabIndex = 0;

  zoetropeState.intervalId = setInterval(() => {
    if (!zoetropeState.isRunning) {
      return;
    }

    try {
      // Activate the current tab using highlight for better performance
      // highlight is faster than update for just switching tabs
      chrome.tabs.highlight({
        windowId: zoetropeState.windowId,
        tabs: currentTabIndex
      }).catch(error => {
        console.error('Error highlighting tab:', error);
        handleStopZoetrope();
      });

      // Move to next tab
      currentTabIndex++;

      // Check if we've completed a full cycle
      if (currentTabIndex >= zoetropeState.tabIds.length) {
        currentTabIndex = 0;
        zoetropeState.currentBatchStart += zoetropeState.framerate;

        // Check if we need to loop back to the beginning
        if (zoetropeState.currentBatchStart >= zoetropeState.frames.length) {
          zoetropeState.currentBatchStart = 0;
        }

        // Only update tab frames if we have more frames than tabs (batching needed)
        if (zoetropeState.frames.length > zoetropeState.framerate) {
          updateTabFrames();
        }
      }
    } catch (error) {
      console.error('Error cycling tabs:', error);
      handleStopZoetrope();
    }
  }, intervalMs);

  console.log(`Started tab cycling with ${intervalMs}ms interval`);
}

async function updateTabFrames() {
  // Update each tab with the next frame in the sequence
  // This runs asynchronously to avoid blocking the animation
  const extensionUrl = chrome.runtime.getURL('frame.html');

  const promises = zoetropeState.tabIds.map((tabId, index) => {
    const frameIndex = (zoetropeState.currentBatchStart + index) % zoetropeState.frames.length;

    return chrome.tabs.update(tabId, {
      url: `${extensionUrl}?frame=${frameIndex}`
    }).catch(error => {
      console.error(`Error updating tab ${tabId}:`, error);
    });
  });

  // Don't await - let it happen in background for smoother animation
  Promise.all(promises).then(() => {
    console.log(`Updated tabs with frames starting from index ${zoetropeState.currentBatchStart}`);
  });
}

async function handleStopZoetrope() {
  console.log('Stopping Zoetrope');

  // Clear interval
  if (zoetropeState.intervalId) {
    clearInterval(zoetropeState.intervalId);
    zoetropeState.intervalId = null;
  }

  // Close window
  if (zoetropeState.windowId) {
    try {
      await chrome.windows.remove(zoetropeState.windowId);
    } catch (error) {
      console.error('Error closing window:', error);
    }
  }

  // Reset state
  zoetropeState.isRunning = false;
  zoetropeState.windowId = null;
  zoetropeState.tabIds = [];
  zoetropeState.currentFrameIndex = 0;
  zoetropeState.currentBatchStart = 0;

  // Update storage
  await chrome.storage.local.set({ isRunning: false });
}

// Handle window close event
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === zoetropeState.windowId) {
    handleStopZoetrope();
  }
});

// Listen for tab removal (in case user closes tabs)
chrome.tabs.onRemoved.addListener((tabId) => {
  const index = zoetropeState.tabIds.indexOf(tabId);
  if (index !== -1) {
    console.log('Zoetrope tab was closed, stopping...');
    handleStopZoetrope();
  }
});
