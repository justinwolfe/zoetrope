# Zoetrope - Chrome Tab Animation Extension

Transform your GIFs into mesmerizing animations using Chrome tabs as a digital zoetrope!

## What is a Zoetrope?

A zoetrope is a pre-film animation device that produces the illusion of motion by displaying a sequence of images through a rotating cylinder. This Chrome extension brings that historic technology into the digital age by using browser tabs as individual frames in an animation.

## Features

- **GIF to Tab Animation**: Upload a GIF or provide a URL, and watch it come to life through rapidly cycling Chrome tabs
- **Multiple Framerates**: Choose from 24, 30, or 60 fps for different animation speeds
- **Frame Extraction**: Automatically extracts individual frames from your GIF
- **Seamless Looping**: Continuously cycles through frames for smooth, endless animation
- **Beautiful Interface**: Modern, gradient-styled UI with drag-and-drop support

## Installation

### From Source (Developer Mode)

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd zoetrope
   ```

2. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   ```
   This will create a `dist/` directory with the built extension.

3. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked"
   - Select the `dist/` directory (not the root directory!)
   - The Zoetrope extension should now appear in your extensions list!

### Development

For development with auto-rebuild:
```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## Usage

### Getting Started

1. **Click the Extension Icon**: Click the Zoetrope icon in your Chrome toolbar to open the popup
2. **Open Settings**: Click "Open Settings" to access the configuration page
3. **Load a GIF**: Either:
   - Enter a GIF URL and click "Load from URL"
   - Drag and drop a GIF file into the drop zone
   - Click the drop zone to browse for a file

4. **Select Framerate**: Choose your desired framerate:
   - 24 fps: Classic film framerate
   - 30 fps: Standard video framerate
   - 60 fps: Smooth, high-speed animation

5. **Start the Zoetrope**: Click "Extract Frames & Start"
6. **Watch the Magic**: A new window will open with multiple tabs, each displaying a frame. The tabs will cycle rapidly to create the animation!

### Stopping the Animation

- Click the "Stop Zoetrope" button in the settings page
- Or close the animation window
- Or click the extension icon and press "Stop Zoetrope"

## How It Works

1. **Frame Extraction**: When you upload a GIF, the extension extracts each individual frame and converts them to static images
2. **Tab Creation**: A new Chrome window is created with N tabs (where N = your selected framerate)
3. **Rapid Cycling**: The extension uses the Chrome Tabs API to rapidly switch between tabs
4. **Frame Batching**: When all frames don't fit in the available tabs, the extension loads frames in batches and cycles through them
5. **Continuous Loop**: The animation loops seamlessly back to the beginning

## Technical Details

### Architecture

The extension uses a webpack build system to bundle npm dependencies:

**Source Files (src/):**
- **background.js**: Service worker handling tab management and cycling
- **options.js**: Settings page logic for GIF upload and configuration
- **frame.js**: Individual frame display logic
- **popup.js**: Extension popup interface logic
- **gif-extractor.js**: GIF frame extraction utility using omggif

**Static Files:**
- **manifest.json**: Extension configuration with required permissions
- **options.html/css**: Settings page markup and styling
- **frame.html**: Individual frame display page
- **popup.html**: Extension popup interface
- **icons/**: Extension icons (16px, 48px, 128px)

**Dependencies:**
- **omggif**: Robust GIF decoder library for frame extraction
- **webpack**: Module bundler for packaging the extension

**Build Output (dist/):**
All files are bundled and copied to the `dist/` directory for Chrome to load.

### Permissions Required

- `tabs`: To create and manage animation tabs
- `storage`: To save extension state
- `<all_urls>`: To load GIFs from external URLs

### Browser Compatibility

- Chrome 88+ (Manifest V3)
- Edge 88+ (Chromium-based)
- Other Chromium browsers supporting Manifest V3

## Known Limitations

- **Large GIFs**: Very large GIFs with many frames may take time to process
- **Tab Limits**: Chrome has limits on rapid tab switching; extremely high framerates may not be perfectly smooth
- **Memory Usage**: Each tab consumes memory; higher framerates use more resources
- **GIF Complexity**: Complex, large-resolution GIFs may impact performance

## Tips for Best Results

1. **Use Simple GIFs**: Smaller, simpler GIFs work best
2. **Optimal Frame Count**: GIFs with 24-60 frames work well
3. **Resolution**: Medium resolution GIFs (400-800px) provide good balance
4. **Framerate**: Start with 24 fps and increase if your system handles it well

## Troubleshooting

### Extension won't load
- Make sure Developer Mode is enabled in `chrome://extensions/`
- Check that all files are present in the directory
- Try reloading the extension

### Frames not extracting
- Ensure the file is a valid GIF
- Try a different GIF or URL
- Check the browser console for errors

### Animation is choppy
- Try a lower framerate (24 fps)
- Use a simpler GIF with fewer frames
- Close other Chrome windows/tabs to free up resources

### Window closes immediately
- Check the browser console for errors
- Ensure the extension has necessary permissions
- Try restarting Chrome

## Future Enhancements

- [ ] Support for video files (MP4, WebM)
- [ ] Custom frame duration control
- [ ] Frame editor for manual adjustments
- [ ] Export animation as video
- [ ] Reverse/loop modes
- [ ] Performance optimizations
- [ ] Frame caching for faster subsequent plays

## Contributing

This is an open-source project! Contributions, issues, and feature requests are welcome.

## License

MIT License - Feel free to use, modify, and distribute!

## Credits

Inspired by the classic zoetrope device and modern web technologies.

Built with:
- Chrome Extensions API (Manifest V3)
- [omggif](https://github.com/deanm/omggif) - GIF decoder library
- Canvas API for frame rendering
- Webpack for module bundling
- Vanilla JavaScript (no frameworks!)

---

**Enjoy creating digital zoetropes!** 🎬✨
