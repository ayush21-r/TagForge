# 🚀 TagForge

### *Next-Generation Photo Geotagging Platform*

> Transform your photos into **GPS-powered visual stories** with real-time maps, location data, and stunning overlays.

![TagForge](https://img.shields.io/badge/TagForge-Advanced%20Geotagging-00f0ff?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-131820?style=for-the-badge)
![Privacy](https://img.shields.io/badge/Privacy-Local%20Processing-a855f7?style=for-the-badge)
![Maps](https://img.shields.io/badge/Maps-Leaflet%20%2B%20OSM-ec4899?style=for-the-badge)

---

## 🌟 Overview

**TagForge** is a modern, browser-based photo geotagging tool that allows users to embed precise location data directly onto images.

Unlike traditional tools, TagForge combines:

* 📍 Interactive maps
* 🛰️ Satellite imagery
* 🧠 Smart UX guidance
* 🎨 Canvas-based rendering
* 🔒 Privacy-first local processing

👉 Result: **Accurate, beautiful, and share-ready geotagged photos — instantly.**

TagForge is built for people who want more than raw coordinates on an image. It helps turn location data into a polished visual layer that is easier to understand, easier to share, and far more professional in presentation.

---

## ✨ Key Features

* 📸 **Photo Upload with EXIF Extraction**  
  Automatically reads GPS and metadata from supported images

* 🗺️ **Interactive Map Selection**  
  Click directly on the map or search for a place to set the exact location

* 🛰️ **Map Mode Toggle (Normal + Satellite)**  
  Switch between labeled maps and real-world imagery depending on your workflow

* 🧠 **Smart UX Hint System**  
  Helps users understand when Normal mode is better for location accuracy

* 🎨 **Canvas-Based Preview Engine**  
  Preview = Final Output for pixel-perfect consistency

* 🧾 **GPS Camera Style Overlay**  
  Location, coordinates, date-time, and address presented in a clean visual format

* 🧭 **Dynamic Map Thumbnail**  
  Embedded mini-map with a location pin inside the final image

* 🌍 **Reverse Geocoding**  
  Converts coordinates into a readable address automatically

* ✍️ **Overlay Customization**  
  Adjust text, size, visibility, and position without breaking the final output

* 🔒 **Privacy First**  
  No uploads, no tracking, no cloud storage — everything runs locally

---

## 🧠 How It Works

```text
Upload Image → Select Location → Customize Overlay → Preview → Download
```

1. **Upload your photo**  
   Add an image from your device. If GPS EXIF data is present, TagForge extracts it automatically.

2. **Choose location via map or search**  
   Fine-tune the exact position using the interactive map, search, or current-location tools.

3. **Customize overlay text and style**  
   Control how the location data appears on the image.

4. **Preview with real-time canvas rendering**  
   The preview uses the same rendering pipeline as the export.

5. **Download final geotagged image**  
   Save a clean, polished image ready for sharing or documentation.

---

## 🗺️ Map Modes Explained

### 🗺️ Normal Mode

* Shows roads, cities, and labels
* Best for **finding locations**
* Ideal for accurate placement before export

### 🛰️ Satellite Mode

* Shows real-world imagery
* Great for visual context and surface detail
* No labels are visible

### ✅ Recommended Workflow

> First select location in **Normal mode**, then switch to **Satellite** for visual accuracy.

This workflow gives the best of both worlds:

* **Precision** while selecting
* **Visual realism** while reviewing
* **Cleaner context** for the final geotagged image

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3 |
| Styling | Glassmorphism + Neon UI |
| Logic | Vanilla JavaScript |
| Maps | Leaflet.js |
| Map Data | OpenStreetMap / CARTO |
| Satellite Tiles | Esri World Imagery |
| Image Processing | Canvas API |
| Metadata | EXIF.js |
| Geocoding | Nominatim (OSM) |

---

## 🏗️ Architecture Highlights

* ⚙️ **State Management System**  
  Centralized state keeps map interactions, metadata, overlay settings, and preview behavior in sync

* 🎨 **Canvas Rendering Pipeline**  
  The same engine powers both preview and download, eliminating output mismatch

* 🧭 **Dynamic Tile-Based Thumbnail System**  
  Generates the map thumbnail from coordinates and active map mode

* 🛡️ **Error Handling & Fallbacks**  
  Uses placeholder thumbnails and safe fallbacks when map tiles fail

* ⚡ **Performance Optimizations**  
  Lightweight rendering flow, cached thumbnail behavior, and minimal unnecessary redraws

* 🧩 **Modular UI Logic**  
  Map controls, metadata updates, preview rendering, and overlay generation stay clearly separated

---

## 🔒 Privacy & Safety

> Your data stays with you.

* ❌ No backend server
* ❌ No image uploads
* ❌ No tracking
* ❌ No account requirement
* ✅ Fully client-side processing
* ✅ Local browser-based rendering only

This makes TagForge especially useful for privacy-sensitive workflows where image ownership and location data should remain under the user’s control.

---

## 🎯 Use Cases

* 📷 Travel Photography
* 📱 Social Media Content
* 🧭 GPS Camera-style Images
* 📍 Location Proof Documentation
* 🏕️ Outdoor and Adventure Logging
* 🏠 Site Visits and Real Estate Photos
* 📰 Journalism and Field Reporting

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/tagforge.git
cd tagforge
open index.html
```

Or simply:

* Download ZIP
* Extract the project
* Open `index.html` in your browser

### Quick Start Workflow

* Upload an image
* Set or correct the location
* Adjust overlay details
* Preview the final composition
* Download the finished image

---

## 💡 Future Improvements

* 🎯 Drag and reposition overlay
* 💾 Save templates / presets
* 📦 Batch image processing
* 🧠 AI-generated captions
* 🌍 More map styles
* 🖼️ Additional export presets
* 📁 Better project packaging / install flow

---

## 🙌 Credits & Open Source Acknowledgment

This project is built using amazing open-source technologies:

* 🌍 **OpenStreetMap** – Map data
* 🗺️ **Leaflet.js** – Interactive maps
* 🛰️ **Esri World Imagery** – Satellite tiles
* 📍 **Nominatim API** – Reverse geocoding
* 📸 **EXIF.js** – Image metadata extraction
* 🎨 **Canvas API** – Final image rendering

Huge respect to the open-source community ❤️

---

## 👨‍💻 Author

**Ayush Roy**  
B.Tech AI/ML Student | Developer | Tech Enthusiast

Passionate about building **scalable, user-focused web applications** with modern interfaces, strong usability, and practical real-world value.

---

## ⭐ Support

If you like this project:

* ⭐ Star this repository
* 🍴 Fork and improve
* 🤝 Contribute ideas
* 🛠️ Open an issue for bugs or enhancements

Every star, suggestion, and contribution helps make TagForge better.

---

## ⚡ Final Note

TagForge is more than a tool —  
it’s a step toward **smart, visual storytelling with location intelligence**.

It blends mapping, metadata, design, and browser-native rendering into one smooth workflow for creating geotagged images that feel accurate, intentional, and presentation-ready.

---
