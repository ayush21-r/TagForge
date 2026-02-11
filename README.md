# 🌍 TagForge - Next-Generation Photo Geotagging Platform

![TagForge Banner](https://img.shields.io/badge/TagForge-Futuristic%20Geotagging-00f0ff?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-a855f7?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-ec4899?style=for-the-badge)

A modern, interactive, and responsive web application for extracting, editing, and adding geotag information to photos. Built with a futuristic design featuring neon cyan & deep charcoal color palette, glassmorphism effects, and smooth animations.

## ✨ Features

### 📸 Photo Upload
- **Drag & Drop** or click to upload images
- Automatic EXIF data extraction
- Support for all major image formats
- Real-time file preview

### 🗺️ Interactive Map
- **Leaflet.js** powered mini-map in sidebar
- Click anywhere to set location
- Custom neon cyan markers
- Reverse geocoding for automatic address lookup
- Current location detection

### ✏️ Metadata Editing
- **Latitude & Longitude** - Manual or automatic extraction
- **Address/Place Name** - Auto-populated or custom
- **Date & Time** - EXIF extraction with manual override
- **Custom Caption** - Add personalized text

### 🎨 Advanced Overlay System
- **GPS Camera Style** - Professional black bar overlay
- **Editable Text** - Full control over overlay content
- **Format**: "Location • Lat XX.XXXXXX° Long XX.XXXXXX° • Date Time"
- **Auto-adjusting** - Scales to any photo size or aspect ratio
- **Text Wrapping** - Automatically wraps long addresses
- **Font Sizes** - Small, Medium, Large, Extra Large options
- **Position Control** - Top or bottom placement
- **Toggle Visibility** - Show/hide overlay in preview
- **Poppins Font** - Clean, bold, professional typography
- **Text Shadow** - Subtle glow for perfect readability

### 🖼️ Live Preview
- **Center Panel** - Large photo preview with live overlay
- Real-time updates as you edit
- Responsive to portrait and landscape photos
- Glassmorphism overlay bar with semi-transparent black background
- White center-aligned text with shadow effects

### 🎨 Design Features
- **Futuristic UI** - F1-inspired geometric design
- **Neon Cyan & Deep Charcoal** color scheme
- **Glassmorphism** cards with backdrop blur
- **Smooth Animations** on hover and interactions
- **Dark/Light Mode** toggle
- **Fully Responsive** - Works on all devices

### 💾 Canvas-Based Export
- **Download with Overlay** - Merged photo + overlay in one image
- **High-Quality JPEG** - 95% quality export
- **Original Resolution** - Maintains full image dimensions
- **Proportional Scaling** - Overlay scales based on image size
- **Professional Rendering** - Poppins font with text shadows
- **Smart Text Wrapping** - Long text automatically wraps to multiple lines
- **Optional Overlay** - Download with or without overlay

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for map tiles and geocoding)

### Installation

1. **Clone or download** this repository:
```bash
git clone https://github.com/yourusername/tagforge.git
cd tagforge
```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. **Access the application**:
   - Navigate to `http://localhost:8000` (if using local server)
   - Or directly open `index.html` in your browser

## 📖 Usage Guide

### 1. Upload a Photo
- Click the upload area or drag & drop an image
- Supported formats: JPG, PNG, WEBP, etc.
- EXIF data will be automatically extracted if available
- Photo appears in center panel with overlay

### 2. View/Edit Location
- **Automatic**: If photo has GPS data, location is auto-populated
- **Manual**: Click on the mini-map (right panel) to set a location
- **Current Location**: Click the locate button (🎯) to use your current position
- Edit latitude/longitude fields directly in left panel

### 3. Edit Metadata
- **Address**: Auto-filled via reverse geocoding or manually enter
- **Date & Time**: Extracted from EXIF or set manually
- **Latitude/Longitude**: Displayed in overlay as degrees
- Overlay text updates automatically as you edit

### 4. Customize Overlay
- **Edit Text**: Modify overlay text directly in the "Overlay Editor" (right panel)
- **Font Size**: Choose from Small, Medium, Large, or Extra Large
- **Position**: Place overlay at top or bottom of photo
- **Toggle Visibility**: Click eye icon to show/hide overlay
- **Apply Changes**: Click "Apply Changes" to update preview
- Overlay format: `Location • Lat XX.XX° Long XX.XX° • Date Time`

### 5. Preview & Download
- **Center Panel**: View live preview with overlay
- **Responsive**: Overlay adjusts to photo dimensions
- **Download**: Click "Download with Overlay" to save
- Downloaded image includes merged overlay at original resolution
- Toggle overlay off before download to save photo without overlay

### 6. Theme Toggle
- Click the sun/moon icon (top-right) to switch themes
- Preference is saved automatically

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Vanilla JS for functionality

### Libraries & APIs
- **[Leaflet.js](https://leafletjs.com/)** - Interactive maps
- **[EXIF.js](https://github.com/exif-js/exif-js)** - EXIF data extraction
- **[Nominatim API](https://nominatim.org/)** - Reverse geocoding
- **[Google Fonts](https://fonts.google.com/)** - Orbitron & Inter fonts

## 🎨 Design System

### Color Palette

#### Dark Theme
- **Background Primary**: `#0a0e17`
- **Background Secondary**: `#131820`
- **Accent Cyan**: `#00f0ff`
- **Accent Purple**: `#a855f7`
- **Accent Pink**: `#ec4899`

#### Light Theme
- **Background Primary**: `#f8fafc`
- **Background Secondary**: `#ffffff`
- **Accent Cyan**: `#0891b2`
- **Accent Purple**: `#9333ea`

### Typography
- **Headings**: Orbitron (Geometric, F1-inspired)
- **Body**: Inter (Clean, modern sans-serif)

### Effects
- Glassmorphism cards
- Neon glow on hover
- Smooth transitions (0.3s ease)
- Custom scrollbar styling

## 📁 Project Structure

```
tagforge/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with themes
├── script.js           # Application logic
└── README.md          # Documentation
```

## 🔧 Configuration

### Map Customization
Edit `script.js` to change default map settings:
```javascript
// Default center location
const state = {
    currentLocation: { lat: 20.5937, lng: 78.9629 }, // India center
    // ... other state
};

// Map tile layer (current default)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // Swap to another provider if desired
});
```

### Overlay Styling
Customize overlay text in `downloadImageWithOverlay()` function:
```javascript
ctx.font = 'bold 24px Orbitron, sans-serif'; // Change font
ctx.fillStyle = 'white'; // Change color
```

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🎯 Use Cases

- **Photographers** - Add GPS Camera style overlays to photos
- **Forensic Experts** - Document evidence with precise coordinates
- **Developers** - Test and manipulate EXIF data
- **Travel Bloggers** - Create professional location-stamped memories
- **Real Estate** - Tag property photos with exact addresses and coordinates
- **Journalists** - Verify and document photo locations
- **Hikers & Adventurers** - Mark trail photos with GPS coordinates
- **Social Media** - Create professional geo-tagged content

## 🔒 Privacy & Security

- **No server uploads** - All processing happens in your browser
- **No data collection** - Your photos never leave your device
- **Local storage only** - Theme preference saved locally
- **Open source** - Fully transparent code

## 🐛 Known Limitations

- Reverse geocoding requires internet connection
- EXIF extraction works best with photos from cameras/smartphones
- Some browsers may require HTTPS for geolocation API
- Large images may take time to process

## 🚧 Future Enhancements

- [ ] Batch processing for multiple photos
- [ ] Custom overlay templates
- [ ] Export with embedded EXIF data
- [ ] Map style customization
- [ ] Photo filters and adjustments
- [ ] Cloud storage integration
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 TagForge

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**TagForge Team**
- Website: [tagforge.com](#)
- Email: contact@tagforge.com

## 🙏 Acknowledgments

- [Leaflet.js](https://leafletjs.com/) for the amazing mapping library
- [EXIF.js](https://github.com/exif-js/exif-js) for EXIF extraction
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [CARTO](https://carto.com/) for beautiful map tiles
- [Google Fonts](https://fonts.google.com/) for typography

---

<div align="center">

**Made with ❤️ for photographers, developers, and geo-enthusiasts**

[⭐ Star this repo](https://github.com/yourusername/tagforge) | [🐛 Report Bug](https://github.com/yourusername/tagforge/issues) | [✨ Request Feature](https://github.com/yourusername/tagforge/issues)

</div>
