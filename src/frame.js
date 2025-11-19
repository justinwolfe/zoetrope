// Frame display script
// This script retrieves the frame data from the URL parameter and displays it

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const frameIndex = parseInt(urlParams.get('frame') || '0');

  // Request frame data from background script
  chrome.runtime.sendMessage(
    { type: 'GET_FRAME', frameIndex },
    (response) => {
      if (response && response.frameData) {
        displayFrame(response.frameData);
      } else {
        console.error('Failed to load frame data');
      }
    }
  );
});

function displayFrame(frameData) {
  const img = document.getElementById('frame-image');

  img.src = frameData.dataUrl;
  img.onload = () => {
    img.classList.add('loaded');
  };
}
