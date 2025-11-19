// GIF Frame Extractor using omggif library
const GifReader = require('omggif').GifReader;

export class GIFExtractor {
  async extractFrames(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    try {
      const gifReader = new GifReader(uint8Array);
      const frameCount = gifReader.numFrames();
      const frames = [];

      // Get GIF dimensions
      const width = gifReader.width;
      const height = gifReader.height;

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Extract each frame
      for (let i = 0; i < frameCount; i++) {
        const frameInfo = gifReader.frameInfo(i);
        const framePixels = new Uint8Array(width * height * 4);

        // Decode frame pixels
        gifReader.decodeAndBlitFrameRGBA(i, framePixels);

        // Clear canvas (handle disposal methods)
        if (i === 0 || frameInfo.disposal === 2) {
          ctx.clearRect(0, 0, width, height);
        }

        // Create ImageData and draw to canvas
        const imageData = new ImageData(
          new Uint8ClampedArray(framePixels),
          width,
          height
        );
        ctx.putImageData(imageData, 0, 0);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');

        frames.push({
          dataUrl,
          delay: frameInfo.delay * 10 || 100, // Convert to milliseconds
          width,
          height
        });
      }

      return frames;
    } catch (error) {
      console.error('Error extracting GIF frames:', error);
      throw new Error(`Failed to extract frames: ${error.message}`);
    }
  }

  async loadFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch GIF');
    }
    const blob = await response.blob();
    if (!blob.type.includes('gif')) {
      throw new Error('URL does not point to a GIF');
    }
    return await this.extractFrames(blob);
  }

  async loadFromFile(file) {
    if (!file.type.includes('gif')) {
      throw new Error('File is not a GIF');
    }
    return await this.extractFrames(file);
  }
}
