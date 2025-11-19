// GIF Frame Extractor using canvas and temporary image elements
// This approach loads the GIF into an offscreen canvas and captures each frame

class GIFFrameExtractor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  async extractFrames(blob) {
    // Create object URL for the blob
    const url = URL.createObjectURL(blob);

    try {
      // Use gifuct-js if available
      if (typeof gifuct !== 'undefined') {
        return await this.extractWithGifuct(blob);
      }

      // Fallback: try to extract using SuperGIF approach
      return await this.extractWithCanvas(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async extractWithGifuct(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const gif = gifuct.parseGIF(arrayBuffer);
    const frames = gifuct.decompressFrames(gif, true);

    return frames.map(frame => {
      this.canvas.width = frame.dims.width;
      this.canvas.height = frame.dims.height;

      const imageData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        frame.dims.width,
        frame.dims.height
      );

      this.ctx.putImageData(imageData, 0, 0);

      return {
        dataUrl: this.canvas.toDataURL('image/png'),
        delay: frame.delay || 100,
        width: frame.dims.width,
        height: frame.dims.height
      };
    });
  }

  async extractWithCanvas(url) {
    // Load the GIF as an image
    const img = await this.loadImage(url);

    // For animated GIFs, we need a different approach
    // Try using a library or extract single frame
    this.canvas.width = img.naturalWidth;
    this.canvas.height = img.naturalHeight;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(img, 0, 0);

    // Return single frame
    return [{
      dataUrl: this.canvas.toDataURL('image/png'),
      delay: 100,
      width: img.naturalWidth,
      height: img.naturalHeight
    }];
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}

// Make available globally
window.GIFFrameExtractor = GIFFrameExtractor;
