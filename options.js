// Options page JavaScript for Zoetrope Chrome Extension

let currentGifData = null;
let extractedFrames = [];
let selectedFramerate = 24;

// DOM elements
const gifUrlInput = document.getElementById('gif-url');
const loadUrlButton = document.getElementById('load-url');
const gifFileInput = document.getElementById('gif-file');
const dropZone = document.getElementById('drop-zone');
const previewImage = document.getElementById('preview-image');
const previewPlaceholder = document.getElementById('preview-placeholder');
const framerateOptions = document.querySelectorAll('input[name="framerate"]');
const startButton = document.getElementById('start-zoetrope');
const stopButton = document.getElementById('stop-zoetrope');
const statusMessage = document.getElementById('status-message');
const frameInfo = document.getElementById('frame-info');
const frameCount = document.getElementById('frame-count');
const animationDuration = document.getElementById('animation-duration');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadUrlButton.addEventListener('click', handleLoadFromUrl);
  gifFileInput.addEventListener('change', handleFileSelect);
  dropZone.addEventListener('click', () => gifFileInput.click());
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);
  startButton.addEventListener('click', handleStartZoetrope);
  stopButton.addEventListener('click', handleStopZoetrope);

  framerateOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      selectedFramerate = parseInt(e.target.value);
    });
  });

  // Load saved state
  chrome.storage.local.get(['isRunning'], (result) => {
    if (result.isRunning) {
      showRunningState();
    }
  });
});

async function handleLoadFromUrl() {
  const url = gifUrlInput.value.trim();
  if (!url) {
    showStatus('Please enter a valid URL', 'error');
    return;
  }

  showStatus('Loading GIF from URL...', 'info');

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');

    const blob = await response.blob();
    if (!blob.type.includes('gif')) {
      throw new Error('URL does not point to a GIF image');
    }

    await processGif(blob, url);
  } catch (error) {
    showStatus(`Error loading GIF: ${error.message}`, 'error');
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    processGifFile(file);
  }
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('dragover');
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('dragover');

  const file = e.dataTransfer.files[0];
  if (file && file.type === 'image/gif') {
    processGifFile(file);
  } else {
    showStatus('Please drop a valid GIF file', 'error');
  }
}

async function processGifFile(file) {
  if (!file.type.includes('gif')) {
    showStatus('Please select a GIF file', 'error');
    return;
  }

  showStatus('Processing GIF...', 'info');
  const url = URL.createObjectURL(file);
  await processGif(file, url);
}

async function processGif(blob, url) {
  try {
    // Show preview
    previewImage.src = url;
    previewImage.style.display = 'block';
    previewPlaceholder.style.display = 'none';

    // Extract frames
    showStatus('Extracting frames...', 'info');
    const frames = await extractGifFrames(blob);

    if (frames.length === 0) {
      throw new Error('No frames could be extracted from this GIF');
    }

    extractedFrames = frames;
    currentGifData = { blob, url };

    // Update UI
    frameCount.textContent = frames.length;
    const totalDuration = frames.reduce((sum, frame) => sum + (frame.delay || 100), 0) / 1000;
    animationDuration.textContent = totalDuration.toFixed(2);
    frameInfo.style.display = 'block';
    startButton.disabled = false;

    showStatus(`Successfully extracted ${frames.length} frames!`, 'success');
  } catch (error) {
    showStatus(`Error processing GIF: ${error.message}`, 'error');
    console.error(error);
  }
}

async function extractGifFrames(blob) {
  const extractor = new GIFFrameExtractor();
  return await extractor.extractFrames(blob);
}

async function handleStartZoetrope() {
  if (extractedFrames.length === 0) {
    showStatus('Please load a GIF first', 'error');
    return;
  }

  showStatus('Starting Zoetrope...', 'info');

  try {
    // Save frames to storage (Chrome has limits, so we'll use a different approach)
    // Instead, we'll save frames to the background script
    await chrome.runtime.sendMessage({
      type: 'START_ZOETROPE',
      frames: extractedFrames,
      framerate: selectedFramerate
    });

    showRunningState();
    showStatus('Zoetrope is running!', 'success');
  } catch (error) {
    showStatus(`Error starting Zoetrope: ${error.message}`, 'error');
    console.error(error);
  }
}

async function handleStopZoetrope() {
  try {
    await chrome.runtime.sendMessage({ type: 'STOP_ZOETROPE' });
    showStoppedState();
    showStatus('Zoetrope stopped', 'info');
  } catch (error) {
    showStatus(`Error stopping Zoetrope: ${error.message}`, 'error');
  }
}

function showRunningState() {
  startButton.style.display = 'none';
  stopButton.style.display = 'block';
}

function showStoppedState() {
  startButton.style.display = 'block';
  stopButton.style.display = 'none';
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type;
  statusMessage.style.display = 'block';

  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, 5000);
  }
}
