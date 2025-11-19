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

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the `zoetrope` directory
6. The Zoetrope extension should now appear in your extensions list!

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

- **manifest.json**: Extension configuration with required permissions
- **background.js**: Service worker handling tab management and cycling
- **options.html/js**: Settings page for GIF upload and configuration
- **frame.html/js**: Individual frame display page
- **popup.html/js**: Extension popup interface
- **lib/gif-frames.js**: GIF frame extraction utility
- **lib/gifuct-js.min.js**: GIF parsing library

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
- Chrome Extensions API
- Canvas API for frame extraction
- Vanilla JavaScript (no frameworks!)

---

**Enjoy creating digital zoetropes!** 🎬✨
