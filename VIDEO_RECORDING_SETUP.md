# Video Recording Setup with CCapture.js

## Setup Instructions

### 1. Download CCapture.js Library

The CCapture.js library needs to be downloaded manually since it's not available as an npm package.

1. Go to: https://raw.githubusercontent.com/spite/ccapture.js/master/build/CCapture.all.min.js
2. Save the file as `public/lib/CCapture.all.min.js` in your project

### 2. Features Added

- **VideoRecorder Component**: Handles video recording with high-quality settings
- **Recording Controls**: Start/Stop recording button in the bottom-left corner
- **Automatic Download**: Recorded videos are automatically downloaded as WebM files
- **High Quality Settings**: 60 FPS, 100% quality, WebM format

### 3. How to Use

1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Click "Start Recording" to begin capturing the 3D animation
4. Click "Stop Recording" to finish and download the video

### 4. Recording Settings

The video recorder is configured with:
- **Format**: WebM (high quality, good compression)
- **Frame Rate**: 60 FPS for smooth animation
- **Quality**: 100% for maximum quality
- **Auto-save**: Disabled (manual save only)

### 5. Troubleshooting

If recording doesn't work:
1. Make sure `CCapture.all.min.js` is properly downloaded to `public/lib/`
2. Check browser console for any errors
3. Ensure your browser supports WebM format
4. Try refreshing the page if the library doesn't load properly

### 6. File Structure

```
public/
  lib/
    CCapture.all.min.js  # Download this file manually
components/
  VideoRecorder.tsx      # Recording component
  ThreedObject.tsx       # Updated 3D component with recording integration
app/
  page.tsx              # Updated main page with recording controls
```

The recording system is now integrated into your 3D animation. Once you download the CCapture.js library file, you'll be able to record high-quality videos of your particle animation! 