// ========================================
// TagForge - Advanced Photo Geotagging Platform
// Enhanced Overlay System
// ========================================

// State Management
const state = {
    uploadedImage: null,
    imageFile: null,
    currentLocation: { lat: 20.5937, lng: 78.9629 }, // Default: India center
    marker: null,
    mapMode: 'normal',
    overlayVisible: true,
    mapThumbnailUrl: null,
    overlaySettings: {
        fontSize: 'medium',
        position: 'bottom',
        text: ''
    },
    metadata: {
        latitude: '',
        longitude: '',
        address: '',
        datetime: '',
        caption: ''
    }
};

let previewRenderToken = 0;
let lastThumbnailKey = '';
let mapHintTimeoutId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    initializeEventListeners();
    initializeTheme();
    setDefaultDateTime();
    updateOverlayText(); // Initialize overlay text
});

// ========================================
// Theme Management
// ========================================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (!themeToggle) {
        return;
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ========================================
// Map Initialization
// ========================================
let map;
let normalLayer;
let satelliteLayer;

function initializeMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet failed to load.');
        return;
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map container element not found.');
        return;
    }

    map = L.map('map').setView([state.currentLocation.lat, state.currentLocation.lng], 5);
    
    // Default basemap: CARTO light tiles.
    normalLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
    });

    // Optional satellite basemap.
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    // Keep current behavior unchanged by loading the normal layer by default.
    normalLayer.addTo(map);
    updateMapToggleUI();

    // If satellite tiles fail while active, silently fall back to the normal map.
    satelliteLayer.on('tileerror', () => {
        if (state.mapMode === 'satellite') {
            console.warn('Satellite tiles failed to load. Falling back to normal map.');
            setMapMode('normal');
        }
    });
    
    // Add click event to map
    map.on('click', onMapClick);
}

function setMapMode(mode) {
    if (!map || !normalLayer || !satelliteLayer) {
        console.error('Map layers are not ready yet.');
        return;
    }

    if (mode === 'satellite') {
        if (map.hasLayer(normalLayer)) {
            map.removeLayer(normalLayer);
        }
        if (!map.hasLayer(satelliteLayer)) {
            satelliteLayer.addTo(map);
        }
        state.mapMode = 'satellite';
        updateMapToggleUI();
        refreshMapThumbnailForCurrentMode();
        showMapHint();
        return;
    }

    if (map.hasLayer(satelliteLayer)) {
        map.removeLayer(satelliteLayer);
    }
    if (!map.hasLayer(normalLayer)) {
        normalLayer.addTo(map);
    }
    state.mapMode = 'normal';
    updateMapToggleUI();
    refreshMapThumbnailForCurrentMode();
}

function toggleMapMode() {
    const nextMode = state.mapMode === 'normal' ? 'satellite' : 'normal';
    setMapMode(nextMode);
}

function showMapHint() {
    const hint = document.getElementById('mapHint');
    if (!hint) {
        return;
    }

    if (mapHintTimeoutId) {
        clearTimeout(mapHintTimeoutId);
        mapHintTimeoutId = null;
    }

    hint.classList.remove('hidden');
    requestAnimationFrame(() => {
        hint.classList.add('show');
    });

    mapHintTimeoutId = setTimeout(() => {
        hint.classList.remove('show');
        mapHintTimeoutId = setTimeout(() => {
            hint.classList.add('hidden');
            mapHintTimeoutId = null;
        }, 300);
    }, 3500);
}

function updateMapToggleUI() {
    const btn = document.getElementById('mapStyleToggleBtn');
    if (!btn) {
        return;
    }

    if (state.mapMode === 'satellite') {
        btn.textContent = '🛰️';
        btn.title = 'Switch to Normal Map';
        btn.setAttribute('aria-label', 'Switch to Normal Map');
        return;
    }

    btn.textContent = '🗺️';
    btn.title = 'Switch to Satellite';
    btn.setAttribute('aria-label', 'Switch to Satellite');
}

function refreshMapThumbnailForCurrentMode() {
    const lat = parseFloat(state.metadata.latitude);
    const lng = parseFloat(state.metadata.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return;
    }

    lastThumbnailKey = '';
    updateMapThumbnail(lat, lng);
}

function onMapClick(e) {
    const { lat, lng } = e.latlng;
    updateMarker(lat, lng);
    updateMetadataFields(lat, lng);
    reverseGeocode(lat, lng);
}

function updateMarker(lat, lng) {
    if (state.marker) {
        map.removeLayer(state.marker);
    }
    
    // Custom marker with cyan color
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #00f0ff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    state.marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    state.currentLocation = { lat, lng };
    
    // Update map info (if element exists)
    const mapInfo = document.getElementById('mapInfo');
    if (mapInfo) {
        mapInfo.innerHTML = `<p>📍 Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>`;
    }
}

function updateMetadataFields(lat, lng) {
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);
    state.metadata.latitude = lat.toFixed(6);
    state.metadata.longitude = lng.toFixed(6);
    
    updateOverlayText();
}

async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        if (!response.ok) {
            throw new Error(`Reverse geocoding failed with status ${response.status}`);
        }
        const data = await response.json();
        
        if (data.display_name) {
            const address = data.display_name;
            document.getElementById('address').value = address;
            state.metadata.address = address;
            updateOverlayText();
        }
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
    }
}

// ========================================
// Event Listeners
// ========================================
function initializeEventListeners() {
    // Location search
    const locationSearch = document.getElementById('locationSearch');
    const clearSearch = document.getElementById('clearSearch');
    const searchResults = document.getElementById('searchResults');
    
    locationSearch.addEventListener('input', handleSearchInput);
    clearSearch.addEventListener('click', clearSearchInput);
    
    // Upload area
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileSelect);
    clearBtn.addEventListener('click', clearUpload);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Metadata inputs
    document.getElementById('latitude').addEventListener('input', handleMetadataChange);
    document.getElementById('longitude').addEventListener('input', handleMetadataChange);
    document.getElementById('address').addEventListener('input', handleMetadataChange);
    document.getElementById('datetime').addEventListener('input', handleMetadataChange);
    document.getElementById('caption').addEventListener('input', handleMetadataChange);
    
    // Overlay editor
    document.getElementById('overlayTextEditor').addEventListener('input', handleOverlayTextEdit);
    document.getElementById('overlayFontSize').addEventListener('change', handleOverlaySizeChange);
    document.getElementById('overlayPosition').addEventListener('change', handleOverlayPositionChange);
    document.getElementById('applyOverlayBtn').addEventListener('click', applyOverlayChanges);
    
    // Preview controls
    document.getElementById('toggleOverlayBtn').addEventListener('click', toggleOverlayVisibility);
    document.getElementById('fitImageBtn').addEventListener('click', fitImageToContainer);
    
    // Buttons
    document.getElementById('mapStyleToggleBtn').addEventListener('click', toggleMapMode);
    document.getElementById('updateMapBtn').addEventListener('click', updateMapFromInputs);
    document.getElementById('locateBtn').addEventListener('click', getCurrentLocation);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    document.getElementById('downloadBtn').addEventListener('click', downloadImageWithOverlay);
}

// ========================================
// File Upload Handlers
// ========================================
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadArea').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadArea').classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('uploadArea').classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
}

function processImage(file) {
    state.imageFile = file;
    
    // Show file info
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileInfo').style.display = 'flex';
    
    // Read image
    const reader = new FileReader();
    reader.onload = (e) => {
        state.uploadedImage = new Image();
        state.uploadedImage.onload = () => {
            displayPhotoPreview();
            extractEXIF(file);
            document.getElementById('downloadBtn').disabled = false;
        };
        state.uploadedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function clearUpload() {
    state.uploadedImage = null;
    state.imageFile = null;
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInfo').style.display = 'none';
    
    // Hide photo preview
    document.getElementById('photoWithOverlay').style.display = 'none';
    document.querySelector('.preview-placeholder').style.display = 'flex';
    document.getElementById('downloadBtn').disabled = true;

    const previewCanvas = document.getElementById('previewCanvas');
    if (previewCanvas) {
        const ctx = previewCanvas.getContext('2d');
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCanvas.width = 0;
        previewCanvas.height = 0;
    }
}

// ========================================
// EXIF Data Extraction
// ========================================
function extractEXIF(file) {
    EXIF.getData(file, function() {
        const lat = EXIF.getTag(this, 'GPSLatitude');
        const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
        const lng = EXIF.getTag(this, 'GPSLongitude');
        const lngRef = EXIF.getTag(this, 'GPSLongitudeRef');
        const dateTime = EXIF.getTag(this, 'DateTime');
        
        if (lat && lng) {
            const latitude = convertDMSToDD(lat, latRef);
            const longitude = convertDMSToDD(lng, lngRef);
            
            updateMarker(latitude, longitude);
            updateMetadataFields(latitude, longitude);
            reverseGeocode(latitude, longitude);
            map.setView([latitude, longitude], 13);
        }
        
        if (dateTime) {
            // Convert EXIF datetime format to datetime-local format
            const formattedDate = formatEXIFDateTime(dateTime);
            document.getElementById('datetime').value = formattedDate;
            state.metadata.datetime = formattedDate;
        }
    });
}

function convertDMSToDD(dms, ref) {
    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];
    
    let dd = degrees + minutes / 60 + seconds / 3600;
    
    if (ref === 'S' || ref === 'W') {
        dd = dd * -1;
    }
    
    return dd;
}

function formatEXIFDateTime(dateTimeStr) {
    // EXIF format: "2025:10:09 17:08:30"
    // datetime-local format: "2025-10-09T17:08"
    const parts = dateTimeStr.split(' ');
    const date = parts[0].replace(/:/g, '-');
    const time = parts[1].substring(0, 5);
    return `${date}T${time}`;
}

// ========================================
// Metadata Handlers
// ========================================
function handleMetadataChange(e) {
    const field = e.target.id;
    state.metadata[field] = e.target.value;
    updateOverlayText();
}

function updateMapFromInputs() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        updateMarker(lat, lng);
        map.setView([lat, lng], 13);
        
        if (!document.getElementById('address').value) {
            reverseGeocode(lat, lng);
        }
    } else {
        alert('Please enter valid latitude (-90 to 90) and longitude (-180 to 180) values.');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                updateMarker(latitude, longitude);
                updateMetadataFields(latitude, longitude);
                reverseGeocode(latitude, longitude);
                map.setView([latitude, longitude], 13);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to get your location. Please check your browser permissions.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

function setDefaultDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('datetime').value = formattedDateTime;
    state.metadata.datetime = formattedDateTime;
}

// ========================================
// Photo Preview Display
// ========================================
function displayPhotoPreview() {
    const photoWithOverlay = document.getElementById('photoWithOverlay');
    const placeholder = document.querySelector('.preview-placeholder');

    // Show the canvas preview. The canvas uses the exact same renderer as
    // download, so preview and exported image stay visually identical.
    placeholder.style.display = 'none';
    photoWithOverlay.style.display = 'flex';
    
    updateOverlayText();
    renderCanvasPreview();
}

function updateOverlayText() {
    const address = state.metadata.address || '';
    const lat = state.metadata.latitude || '';
    const lng = state.metadata.longitude || '';
    const datetime = state.metadata.datetime || '';

    // Keep raw metadata as strings for display, but always use parsed numbers
    // for map rendering and coordinate math. This prevents valid string inputs
    // from being rejected by Number.isFinite() downstream.
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const hasValidCoordinates = Number.isFinite(parsedLat) && Number.isFinite(parsedLng);

    console.debug('Overlay coordinates:', {
        rawLat: lat,
        rawLng: lng,
        parsedLat,
        parsedLng,
        hasValidCoordinates
    });
    
    // Extract short location name (city, state, country) from full address
    let shortLocation = address;
    if (address) {
        const parts = address.split(',');
        // Try to get city, state, country format
        if (parts.length >= 3) {
            const country = parts[parts.length - 1].trim();
            const state = parts[parts.length - 2].trim();
            const city = parts[0].trim();
            shortLocation = `${city}, ${state}, ${country}`;
        }
    }
    
    // Generate Plus Code from coordinates
    let plusCode = '';
    if (hasValidCoordinates) {
        plusCode = generatePlusCode(parsedLat, parsedLng);
    }
    
    // Build multi-line overlay text in GPS Camera style
    let line1 = shortLocation || 'Nagpur, Maharashtra, India 🇮🇳';
    let line2 = '';
    let line3 = '';
    let line4 = '';
    
    // Line 2: Plus Code + Full address
    if (address && plusCode) {
        line2 = `${plusCode}, ${address}`;
    } else if (address) {
        line2 = address;
    } else if (plusCode) {
        line2 = plusCode;
    }
    
    // Line 3: Coordinates
    if (hasValidCoordinates) {
        line3 = `Lat ${parsedLat.toFixed(6)}° Long ${parsedLng.toFixed(6)}°`;
    }
    
    // Line 4: Date and time
    if (datetime) {
        line4 = formatGPSDateTime(datetime);
    }
    
    // Combine all lines
    let overlayText = line1;
    if (line2) overlayText += `\n${line2}`;
    if (line3) overlayText += `\n${line3}`;
    if (line4) overlayText += `\n${line4}`;
    
    // Update editor state. The visible preview is canvas-rendered, not HTML.
    const editorText = document.getElementById('overlayTextEditor');
    
    if (overlayText) {
        editorText.value = overlayText;
        state.overlaySettings.text = overlayText;
    } else {
        editorText.value = '';
        state.overlaySettings.text = '';
    }
    
    // Update the map thumbnail only with validated numeric coordinates.
    if (hasValidCoordinates) {
        updateMapThumbnail(parsedLat, parsedLng);
    } else {
        state.mapThumbnailUrl = null;
        renderCanvasPreview();
        console.warn('Skipping map thumbnail update because coordinates are invalid.', {
            lat,
            lng
        });
    }
}

// Generate Plus Code (Open Location Code) from coordinates
function generatePlusCode(lat, lng) {
    try {
        // Check if OpenLocationCode library is loaded
        if (typeof OpenLocationCode !== 'undefined') {
            const olc = new OpenLocationCode();
            // Generate short code (8 characters: XXXX+XXX)
            const fullCode = olc.encode(lat, lng, 10);
            // Get short code (remove area prefix for cleaner look)
            const shortCode = fullCode.substring(0, 8).toLowerCase();
            return shortCode;
        } else {
            console.warn('OpenLocationCode library not loaded');
            return '';
        }
    } catch (error) {
        console.error('Error generating Plus Code:', error);
        return '';
    }
}

// ========================================
// Map Thumbnail Capture using Leaflet
// ========================================
function updateMapThumbnail(lat, lng) {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    console.debug('Updating map thumbnail:', {
        lat,
        lng,
        parsedLat,
        parsedLng
    });
    
    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
        state.mapThumbnailUrl = null;
        lastThumbnailKey = '';
        renderCanvasPreview();
        console.warn('Map thumbnail not rendered because coordinates are invalid.', {
            lat,
            lng
        });
        return;
    }

    const thumbnailKey = `${parsedLat.toFixed(6)},${parsedLng.toFixed(6)}`;
    if (state.mapThumbnailUrl && thumbnailKey === lastThumbnailKey) {
        renderCanvasPreview();
        return;
    }
    lastThumbnailKey = thumbnailKey;

    // Store and render a generated placeholder immediately. If the network tile
    // fails or is slow, preview/download still get a visible map thumbnail.
    createPlaceholderThumbnail(parsedLat, parsedLng);
    
    // Fetch a single static tile for the thumbnail using CARTO basemaps.
    const zoom = 13;
    const maxMercatorLatitude = 85.05112878;
    const tileLat = Math.max(Math.min(parsedLat, maxMercatorLatitude), -maxMercatorLatitude);
    
    // Convert lat/lng to tile coordinates
    const latRad = tileLat * Math.PI / 180;
    const n = Math.pow(2, zoom);
    const xtile = Math.floor((parsedLng + 180) / 360 * n);
    const ytile = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);

    if (!Number.isFinite(xtile) || !Number.isFinite(ytile)) {
        console.error('Unable to calculate map tile coordinates. Keeping placeholder thumbnail.', {
            parsedLat,
            parsedLng,
            xtile,
            ytile
        });
        renderCanvasPreview();
        return;
    }
    
    let tileUrl;

    if (state.mapMode === 'satellite') {
        tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${ytile}/${xtile}`;
    } else {
        const subdomains = ['a', 'b', 'c', 'd'];
        const subdomain = subdomains[Math.abs((xtile + ytile) % subdomains.length)];
        tileUrl = `https://${subdomain}.basemaps.cartocdn.com/light_all/${zoom}/${xtile}/${ytile}.png`;
    }
    
    console.log('Using tile URL:', tileUrl);
    
    // Load tile and add pin
    const tileImg = new Image();
    tileImg.crossOrigin = 'anonymous';
    
    tileImg.onload = function() {
        console.log('✅ Map tile loaded successfully!');

        try {
            // Create canvas to draw tile + pin
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            // Draw the tile
            ctx.drawImage(tileImg, 0, 0, 200, 200);
            
            // Draw red pin in center
            drawLocationPin(ctx, 100, 100);
            
            // Convert to data URL
            const dataUrl = canvas.toDataURL('image/png');
            
            state.mapThumbnailUrl = dataUrl;
            renderCanvasPreview();
        } catch (error) {
            console.error('Failed to render map tile thumbnail. Keeping placeholder thumbnail.', error);
            createPlaceholderThumbnail(parsedLat, parsedLng);
        }
    };
    
    tileImg.onerror = function() {
        console.error('❌ Failed to load map tile. Using placeholder thumbnail.', {
            tileUrl,
            lat: parsedLat,
            lng: parsedLng
        });
        // Fallback to placeholder
        createPlaceholderThumbnail(parsedLat, parsedLng);
    };
    
    tileImg.src = tileUrl;
}

function createPlaceholderThumbnail(lat, lng) {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#1a1f2e');
    gradient.addColorStop(1, '#0a0e17');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    // Draw border
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, 190, 190);
    
    // Draw red location pin
    drawLocationPin(ctx, 100, 100);
    
    // Draw text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Poppins, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Location', 100, 145);
    ctx.font = '11px Poppins, Arial';
    ctx.fillText(`${parseFloat(lat).toFixed(4)}°`, 100, 165);
    ctx.fillText(`${parseFloat(lng).toFixed(4)}°`, 100, 180);
    
    const dataUrl = canvas.toDataURL('image/png');
    state.mapThumbnailUrl = dataUrl;
    renderCanvasPreview();
    
    console.log('✅ Using placeholder thumbnail');
}

// Draw a red location pin on canvas
function drawLocationPin(ctx, x, y) {
    const pinSize = 20;
    
    // Save context state
    ctx.save();
    
    // Draw pin shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Draw red circle (top of pin)
    ctx.fillStyle = '#EA4335'; // Google Maps red
    ctx.beginPath();
    ctx.arc(x, y - pinSize / 2, pinSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pin point (triangle)
    ctx.beginPath();
    ctx.moveTo(x, y + pinSize / 2); // Bottom point
    ctx.lineTo(x - pinSize / 3, y - pinSize / 4); // Left
    ctx.lineTo(x + pinSize / 3, y - pinSize / 4); // Right
    ctx.closePath();
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Draw white circle in center
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y - pinSize / 2, pinSize / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw border around white circle
    ctx.strokeStyle = '#EA4335';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Restore context state
    ctx.restore();
}

function captureMapThumbnail(mapThumbnail) {
    console.log('🎬 Starting map capture...');
    console.log('leafletImage available?', typeof leafletImage !== 'undefined');
    console.log('map object:', map);
    
    // Check if leafletImage is available
    if (typeof leafletImage === 'undefined') {
        console.error('❌ leaflet-image library not loaded!');
        console.log('Trying manual canvas capture as fallback...');
        
        // Fallback: Use simple canvas approach
        try {
            const mapContainer = document.getElementById('map');
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            // Draw a simple placeholder with location info
            ctx.fillStyle = '#1a1f2e';
            ctx.fillRect(0, 0, 200, 200);
            ctx.fillStyle = '#00f0ff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Map View', 100, 90);
            ctx.font = '12px Arial';
            ctx.fillText(`${state.metadata.latitude}`, 100, 110);
            ctx.fillText(`${state.metadata.longitude}`, 100, 130);
            
            const dataUrl = canvas.toDataURL('image/png');
            mapThumbnail.src = dataUrl;
            mapThumbnail.style.display = 'block';
            state.mapThumbnailUrl = dataUrl;
            console.log('✅ Using placeholder thumbnail');
        } catch (e) {
            console.error('❌ Fallback also failed:', e);
            mapThumbnail.style.display = 'none';
        }
        return;
    }
    
    console.log('📸 Attempting leaflet-image capture...');
    
    // Capture the current map view
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error('❌ Error capturing map:', err);
            mapThumbnail.style.display = 'none';
            return;
        }
        
        console.log('✅ Map captured! Canvas size:', canvas.width, 'x', canvas.height);
        
        // Create a smaller thumbnail canvas
        const thumbnailCanvas = document.createElement('canvas');
        const thumbnailSize = 200;
        thumbnailCanvas.width = thumbnailSize;
        thumbnailCanvas.height = thumbnailSize;
        
        const ctx = thumbnailCanvas.getContext('2d');
        
        // Draw the captured map onto thumbnail canvas (scaled down)
        ctx.drawImage(canvas, 0, 0, thumbnailSize, thumbnailSize);
        
        // Draw red location pin in center
        drawLocationPin(ctx, thumbnailSize / 2, thumbnailSize / 2);
        
        // Convert to data URL
        const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/png');
        
        console.log('📦 Data URL created, length:', thumbnailDataUrl.length);
        
        // Set the thumbnail image
        mapThumbnail.src = thumbnailDataUrl;
        mapThumbnail.style.display = 'block';
        mapThumbnail.style.visibility = 'visible';
        
        // Store for download
        state.mapThumbnailUrl = thumbnailDataUrl;
        
        console.log('✅ Map thumbnail set successfully!');
        console.log('Thumbnail display:', mapThumbnail.style.display);
        console.log('Thumbnail visible:', mapThumbnail.offsetWidth > 0);
    });
}

function formatDisplayDateTime(datetimeLocal) {
    const date = new Date(datetimeLocal);
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    
    return date.toLocaleString('en-US', options).replace(',', ' •');
}

function formatGPSDateTime(datetimeLocal) {
    const date = new Date(datetimeLocal);
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const hoursStr = String(hours).padStart(2, '0');
    
    // Get timezone offset
    const offset = -date.getTimezoneOffset();
    const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
    const offsetSign = offset >= 0 ? '+' : '-';
    
    return `${month}/${day}/${year} ${hoursStr}:${minutes} ${ampm} GMT ${offsetSign}${offsetHours}:${offsetMinutes}`;
}

// ========================================
// Overlay Editor Functions
// ========================================
function handleOverlayTextEdit(e) {
    const text = e.target.value;
    state.overlaySettings.text = text;
    renderCanvasPreview();
}

function handleOverlaySizeChange(e) {
    state.overlaySettings.fontSize = e.target.value;
    applyOverlaySettings();
    renderCanvasPreview();
}

function handleOverlayPositionChange(e) {
    state.overlaySettings.position = e.target.value;
    applyOverlaySettings();
    renderCanvasPreview();
}

function applyOverlayChanges() {
    applyOverlaySettings();
    renderCanvasPreview();
    // Show feedback
    const btn = document.getElementById('applyOverlayBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Applied!';
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 1500);
}

function applyOverlaySettings() {
    // Preview is rendered on canvas, so settings are applied by
    // drawOverlayOnCanvas() instead of mutating HTML overlay classes.
}

function toggleOverlayVisibility() {
    state.overlayVisible = !state.overlayVisible;
    renderCanvasPreview();
}

function fitImageToContainer() {
    // This is handled by CSS, just provide visual feedback
    const btn = document.getElementById('fitImageBtn');
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

// ========================================
// Canvas-Based Download with Overlay
// ========================================
async function renderCanvasPreview() {
    const previewCanvas = document.getElementById('previewCanvas');

    if (!previewCanvas || !state.uploadedImage) {
        return;
    }

    const renderToken = ++previewRenderToken;

    // Batch rapid metadata/editor changes into the next frame so typing stays
    // smooth while still using the same renderer as the final download.
    await new Promise(resolve => requestAnimationFrame(resolve));

    if (renderToken !== previewRenderToken) {
        return;
    }

    await renderImageWithOverlay(previewCanvas);
}

async function renderImageWithOverlay(canvas) {
    const ctx = canvas.getContext('2d');
    const imageWidth = state.uploadedImage.naturalWidth || state.uploadedImage.width;
    const imageHeight = state.uploadedImage.naturalHeight || state.uploadedImage.height;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(state.uploadedImage, 0, 0, canvas.width, canvas.height);

    if (state.overlayVisible && state.overlaySettings.text) {
        await drawOverlayOnCanvas(ctx, canvas.width, canvas.height);
    }
}

async function downloadImageWithOverlay() {
    if (!state.uploadedImage) {
        alert('Please upload an image first.');
        return;
    }
    
    const canvas = document.createElement('canvas');
    await renderImageWithOverlay(canvas);
    
    // Download
    canvas.toBlob((blob) => {
        if (!blob) {
            alert('Unable to generate the image file. Please try again.');
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `geovide_${Date.now()}.jpg`;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
}

async function drawOverlayOnCanvas(ctx, width, height) {
    const overlayText = state.overlaySettings.text;
    const position = state.overlaySettings.position;
    const fontSize = state.overlaySettings.fontSize;
    
    // Calculate font size based on image width and setting
    let baseFontSize = width * 0.025; // 2.5% of image width
    
    switch (fontSize) {
        case 'small':
            baseFontSize *= 0.7;
            break;
        case 'medium':
            baseFontSize *= 1;
            break;
        case 'large':
            baseFontSize *= 1.4;
            break;
        case 'xlarge':
            baseFontSize *= 1.8;
            break;
    }
    
    // Set text properties FIRST to measure text
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${baseFontSize}px Poppins, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // Calculate text area (accounting for map thumbnail)
    const textStartX = state.mapThumbnailUrl ? 140 : 20;
    const maxWidth = width - textStartX - 40; // Extra margin for safety
    
    // Split text by line breaks AND wrap long lines
    const rawLines = overlayText.split('\n');
    const wrappedLines = [];
    
    rawLines.forEach(line => {
        const wrapped = wrapText(ctx, line, maxWidth);
        wrappedLines.push(...wrapped);
    });
    
    // Calculate line height based on font size
    const lineHeight = baseFontSize * 1.7;
    
    // Calculate AUTOMATIC overlay height based on WRAPPED content
    const padding = 30;
    const mapSize = state.mapThumbnailUrl ? 100 : 0;
    const totalTextHeight = wrappedLines.length * lineHeight;
    const overlayHeight = Math.max(totalTextHeight + (padding * 2), mapSize + (padding * 2));
    
    // Position overlay
    const overlayY = position === 'top' ? 0 : height - overlayHeight;
    
    // Draw semi-transparent black bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, overlayY, width, overlayHeight);
    
    // Draw map thumbnail if available
    if (state.mapThumbnailUrl) {
        try {
            const mapImg = await loadImage(state.mapThumbnailUrl);
            const mapX = 20;
            const mapY = overlayY + (overlayHeight - mapSize) / 2;
            
            // Draw map with border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(mapX, mapY, mapSize, mapSize);
            ctx.drawImage(mapImg, mapX, mapY, mapSize, mapSize);
        } catch (error) {
            console.error('Failed to load map thumbnail:', error);
        }
    }
    
    // Reset text properties for drawing
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${baseFontSize}px Poppins, sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    // Draw text starting from top with padding
    let textY = overlayY + padding;
    
    // Draw each wrapped line
    wrappedLines.forEach(line => {
        ctx.fillText(line, textStartX, textY);
        textY += lineHeight;
    });
}

// Helper function to load images
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Only set crossOrigin for external URLs, not data URLs
        if (!url.startsWith('data:')) {
            img.crossOrigin = 'anonymous';
        }
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    });
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [text];
}

// ========================================
// Reset Functionality
// ========================================
function resetAll() {
    // Clear upload
    clearUpload();
    
    // Reset metadata
    document.getElementById('latitude').value = '';
    document.getElementById('longitude').value = '';
    document.getElementById('address').value = '';
    document.getElementById('caption').value = '';
    setDefaultDateTime();
    
    state.metadata = {
        latitude: '',
        longitude: '',
        address: '',
        datetime: document.getElementById('datetime').value,
        caption: ''
    };
    
    // Reset overlay settings
    state.overlayVisible = true;
    state.overlaySettings = {
        fontSize: 'medium',
        position: 'bottom',
        text: ''
    };
    
    document.getElementById('overlayTextEditor').value = '';
    document.getElementById('overlayFontSize').value = 'medium';
    document.getElementById('overlayPosition').value = 'bottom';
    
    // Reset map
    if (state.marker) {
        map.removeLayer(state.marker);
        state.marker = null;
    }
    
    map.setView([20.5937, 78.9629], 5);
    
    // Reset overlay display
    updateOverlayText();
}

// ========================================
// Location Search Functionality
// ========================================
let searchTimeout;

function handleSearchInput(e) {
    const query = e.target.value.trim();
    const clearBtn = document.getElementById('clearSearch');
    const searchResults = document.getElementById('searchResults');
    
    // Show/hide clear button
    clearBtn.style.display = query ? 'block' : 'none';
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    if (query.length < 3) {
        searchResults.style.display = 'none';
        return;
    }
    
    // Show loading
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<div class="search-loading">🔍 Searching...</div>';
    
    // Debounce search
    searchTimeout = setTimeout(() => {
        searchLocation(query);
    }, 500);
}

async function searchLocation(query) {
    const searchResults = document.getElementById('searchResults');
    
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        if (!response.ok) {
            throw new Error(`Search failed with status ${response.status}`);
        }
        const results = await response.json();
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            return;
        }
        
        // Display results
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" data-lat="${result.lat}" data-lon="${result.lon}">
                <div class="search-result-name">${result.name || result.display_name.split(',')[0]}</div>
                <div class="search-result-address">${result.display_name}</div>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lon = parseFloat(item.dataset.lon);
                selectSearchResult(lat, lon, item.querySelector('.search-result-address').textContent);
            });
        });
        
    } catch (error) {
        console.error('Search failed:', error);
        searchResults.innerHTML = '<div class="search-no-results">Search failed. Please try again.</div>';
    }
}

function selectSearchResult(lat, lng, address) {
    // Hide search results
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('locationSearch').value = address;
    
    // Update map
    map.setView([lat, lng], 15);
    updateMarker(lat, lng);
    updateMetadataFields(lat, lng);
    
    // Set address
    document.getElementById('address').value = address;
    state.metadata.address = address;
    updateOverlayText();
}

function clearSearchInput() {
    document.getElementById('locationSearch').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    document.getElementById('searchResults').style.display = 'none';
}
