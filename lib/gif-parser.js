// Custom GIF Parser for extracting frames
// Based on the GIF89a specification

class GIFParser {
  constructor(arrayBuffer) {
    this.data = new Uint8Array(arrayBuffer);
    this.pos = 0;
  }

  readByte() {
    return this.data[this.pos++];
  }

  readBytes(n) {
    const bytes = this.data.slice(this.pos, this.pos + n);
    this.pos += n;
    return bytes;
  }

  readUint16() {
    const val = this.data[this.pos] | (this.data[this.pos + 1] << 8);
    this.pos += 2;
    return val;
  }

  async parse() {
    // Read header
    const signature = String.fromCharCode(...this.readBytes(3));
    const version = String.fromCharCode(...this.readBytes(3));

    if (signature !== 'GIF') {
      throw new Error('Not a GIF file');
    }

    // Read Logical Screen Descriptor
    const width = this.readUint16();
    const height = this.readUint16();
    const packed = this.readByte();
    const bgColorIndex = this.readByte();
    const pixelAspectRatio = this.readByte();

    const globalColorTableFlag = (packed & 0x80) >> 7;
    const colorResolution = (packed & 0x70) >> 4;
    const sortFlag = (packed & 0x08) >> 3;
    const globalColorTableSize = 2 << (packed & 0x07);

    let globalColorTable = null;
    if (globalColorTableFlag) {
      globalColorTable = this.readBytes(globalColorTableSize * 3);
    }

    const frames = [];
    let graphicControlExt = null;

    // Read data stream
    while (this.pos < this.data.length) {
      const block = this.readByte();

      if (block === 0x21) { // Extension
        const label = this.readByte();

        if (label === 0xF9) { // Graphic Control Extension
          const blockSize = this.readByte();
          const packed = this.readByte();
          const delay = this.readUint16();
          const transparentColorIndex = this.readByte();
          this.readByte(); // Block terminator

          graphicControlExt = {
            disposalMethod: (packed & 0x1C) >> 2,
            userInputFlag: (packed & 0x02) >> 1,
            transparentColorFlag: packed & 0x01,
            delay: delay * 10, // Convert to milliseconds
            transparentColorIndex
          };
        } else {
          // Skip other extensions
          this.skipSubBlocks();
        }
      } else if (block === 0x2C) { // Image Descriptor
        const left = this.readUint16();
        const top = this.readUint16();
        const width = this.readUint16();
        const height = this.readUint16();
        const packed = this.readByte();

        const localColorTableFlag = (packed & 0x80) >> 7;
        const interlaceFlag = (packed & 0x40) >> 6;
        const sortFlag = (packed & 0x20) >> 5;
        const localColorTableSize = 2 << (packed & 0x07);

        let colorTable = globalColorTable;
        if (localColorTableFlag) {
          colorTable = this.readBytes(localColorTableSize * 3);
        }

        // Skip LZW data
        const lzwMinimumCodeSize = this.readByte();
        this.skipSubBlocks();

        frames.push({
          left,
          top,
          width,
          height,
          delay: graphicControlExt ? graphicControlExt.delay : 100,
          disposalMethod: graphicControlExt ? graphicControlExt.disposalMethod : 0,
          colorTable
        });

        graphicControlExt = null;
      } else if (block === 0x3B) { // Trailer
        break;
      } else if (block === 0x00) {
        // Skip null bytes
        continue;
      } else {
        // Unknown block, try to skip
        break;
      }
    }

    return { width, height, frames };
  }

  skipSubBlocks() {
    let blockSize = this.readByte();
    while (blockSize !== 0) {
      this.pos += blockSize;
      blockSize = this.readByte();
    }
  }
}

// Export for use in options.js
window.GIFParser = GIFParser;
