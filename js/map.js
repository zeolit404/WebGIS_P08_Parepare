/* =========================================================
   WEBGIS ANALISIS SPASIAL WISATA & HOTEL KOTA PAREPARE
   File: js/map.js
   Mahasiswa: M. Arief Abdillah (V126241003)
   ========================================================= */

// Inisialisasi Peta Leaflet (Pusat di Kota Parepare)
const mapCenter = [-4.0150, 119.6300];
const initialZoom = 13;

const map = L.map('map', {
  center: mapCenter,
  zoom: initialZoom,
  zoomControl: false // Kita posisikan ulang di kanan atas
});

// Pindahkan Zoom Control ke kanan atas
L.control.zoom({ position: 'topright' }).addTo(map);

// Skala Peta di kiri bawah
L.control.scale({ position: 'bottomleft', imperial: false, metric: true }).addTo(map);

/* ================= 1. BASEMAPS ================= */
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const esriSatelit = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const esriTopo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, METI, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

// Set basemap default
osm.addTo(map);

// Custom Pane khusus buffer destinasi aktif agar selalu tampil DI ATAS buffer keseluruhan (overlayPane)
map.createPane('activeDestinationPane');
map.getPane('activeDestinationPane').style.zIndex = 480; // Di atas overlayPane (400) dan di bawah markerPane (600)


/* ================= 2. DATA LAYERS & GROUPS ================= */
let layerKecamatan;
let layerBuffer;
const layerWisataGroup = L.layerGroup();
const layerHotelBintangGroup = L.layerGroup();
const layerWismaGroup = L.layerGroup();
const layerPenginapanGroup = L.layerGroup();

// Warna khas per kecamatan
const kecColors = {
  'Bacukiki Barat': '#0284c7',
  'Bacukiki': '#10b981',
  'Ujung': '#f59e0b',
  'Soreang': '#8b5cf6'
};

/* ================= 3. LAYER KECAMATAN ================= */
function getKecamatanStyle(feature) {
  const color = kecColors[feature.properties.kecamatan] || '#64748b';
  return {
    fillColor: color,
    weight: 2.5,
    opacity: 0.9,
    color: '#1e293b',
    dashArray: '3',
    fillOpacity: 0.18
  };
}

function highlightKecamatan(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 4,
    color: '#0284c7',
    dashArray: '',
    fillOpacity: 0.4
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToBack();
  }
}

function resetHighlightKecamatan(e) {
  layerKecamatan.resetStyle(e.target);
}

function zoomToKecamatan(e) {
  map.fitBounds(e.target.getBounds());
}

if (typeof dataKecamatan !== 'undefined') {
  layerKecamatan = L.geoJSON(dataKecamatan, {
    style: getKecamatanStyle,
    onEachFeature: function(feature, layer) {
      const p = feature.properties;
      
      // Hitung ringkasan fasilitas di kecamatan ini
      let wisataCount = 0;
      let hotelCount = 0;
      if (typeof dataWisata !== 'undefined') {
        wisataCount = dataWisata.features.filter(w => w.properties.kecamatan === p.kecamatan).length;
      }
      if (typeof dataHotel !== 'undefined') {
        hotelCount = dataHotel.features.filter(h => h.properties.kecamatan === p.kecamatan).length;
      }

      const popupContent = `
        <div class="popup-card">
          <div class="popup-header">
            <span class="badge">Wilayah Administrasi</span>
            <h3>Kecamatan ${p.kecamatan}</h3>
          </div>
          <div class="popup-body">
            <div class="popup-row">
              <span class="key">Kota / Provinsi:</span>
              <span class="val">${p.kota}, ${p.provinsi}</span>
            </div>
            <div class="popup-row">
              <span class="key">Luas Wilayah:</span>
              <span class="val">${p.luas_km2} km²</span>
            </div>
            <div class="popup-row">
              <span class="key">Jumlah Penduduk:</span>
              <span class="val">${p.penduduk_jiwa.toLocaleString('id-ID')} Jiwa</span>
            </div>
            <div class="popup-row">
              <span class="key">Kepadatan:</span>
              <span class="val">${p.kepadatan_jiwa_km2.toLocaleString('id-ID')} Jiwa/km²</span>
            </div>
            <div class="popup-row">
              <span class="key">Jumlah Kelurahan:</span>
              <span class="val">${p.jumlah_kelurahan} Kelurahan</span>
            </div>
            <div class="popup-row">
              <span class="key">Sebaran Wisata:</span>
              <span class="val" style="color: #059669; font-weight:700;">${wisataCount} Destinasi</span>
            </div>
            <div class="popup-row">
              <span class="key">Sebaran Hotel:</span>
              <span class="val" style="color: #0284c7; font-weight:700;">${hotelCount} Akomodasi</span>
            </div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">
              Sumber: ${p.sumber_data}
            </div>
          </div>
        </div>
      `;
      layer.bindPopup(popupContent);
      
      layer.on({
        mouseover: highlightKecamatan,
        mouseout: resetHighlightKecamatan,
        click: zoomToKecamatan
      });
    }
  }).addTo(map);
}

/* ================= 4. LAYER BUFFER 2 KM ================= */
if (typeof dataBufferHotel !== 'undefined') {
  layerBuffer = L.geoJSON(dataBufferHotel, {
    style: function(feature) {
      return {
        fillColor: '#38bdf8',
        fillOpacity: 0.16,
        color: '#0284c7',
        weight: 1.8,
        dashArray: '4, 4'
      };
    },
    onEachFeature: function(feature, layer) {
      const p = feature.properties;
      const popupContent = `
        <div class="popup-card">
          <div class="popup-header hotel">
            <span class="badge">Analisis Spasial Jangkauan</span>
            <h3>${p.nama || 'Buffer Radius Hotel'}</h3>
          </div>
          <div class="popup-body">
            <div class="popup-row">
              <span class="key">Radius Jangkauan:</span>
              <span class="val">2,0 Kilometer</span>
            </div>
            <div class="popup-row">
              <span class="key">Metode Analisis:</span>
              <span class="val">Geodesic Buffer (Turf.js)</span>
            </div>
            <div class="popup-row">
              <span class="key">Tujuan:</span>
              <span class="val">Menilai keterjangkauan akomodasi bagi wisatawan</span>
            </div>
          </div>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  }).addTo(map);
}

/* ================= 5. LAYER HOTEL ================= */
function createHotelIcon(tipe = 'Hotel') {
  let pinClass = 'pin-hotel';
  let iconName = 'fa-hotel';
  if (tipe === 'Wisma') {
    pinClass = 'pin-wisma';
    iconName = 'fa-house-user';
  } else if (tipe === 'Penginapan') {
    pinClass = 'pin-penginapan';
    iconName = 'fa-bed';
  }

  return L.divIcon({
    className: 'custom-pin-container',
    html: `<div class="custom-pin ${pinClass}" title="${tipe}"><i class="fa-solid ${iconName}"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
}

if (typeof dataHotel !== 'undefined') {
  dataHotel.features.forEach(h => {
    const p = h.properties;
    const marker = L.marker([p.latitude, p.longitude], {
      icon: createHotelIcon(p.tipe)
    });

    const popupContent = `
      <div class="popup-card">
        <div class="popup-header hotel">
          <span class="badge">${p.kategori}</span>
          <h3>${p.nama}</h3>
        </div>
        <div class="popup-body">
          <div class="popup-row">
            <span class="key">Kecamatan:</span>
            <span class="val">${p.kecamatan}</span>
          </div>
          <div class="popup-row">
            <span class="key">Alamat:</span>
            <span class="val">${p.alamat}</span>
          </div>
          <div class="popup-row">
            <span class="key">Kisaran Tarif:</span>
            <span class="val" style="color: #0284c7;">${p.kisaran_harga}</span>
          </div>
          <div class="popup-row">
            <span class="key">Kontak:</span>
            <span class="val">${p.telepon}</span>
          </div>
          <div style="font-size: 11px; margin-top: 4px;">
            <strong>Fasilitas:</strong> ${p.fasilitas}
          </div>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent);
    if (p.tipe === 'Wisma') {
      layerWismaGroup.addLayer(marker);
    } else if (p.tipe === 'Penginapan') {
      layerPenginapanGroup.addLayer(marker);
    } else {
      layerHotelBintangGroup.addLayer(marker);
    }
  });
  layerHotelBintangGroup.addTo(map);
  layerWismaGroup.addTo(map);
  layerPenginapanGroup.addTo(map);
}

/* ================= 6. LAYER WISATA & BUFFER INTERAKTIF PER TITIK ================= */
let activeDestinationBuffer = null;
const activeConnectorGroup = L.featureGroup().addTo(map);
const wisataMarkersMap = {};

// Geodesic distance (Haversine Formula) untuk perhitungan presisi meter
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Temukan seluruh fasilitas akomodasi yang berada dalam radius 2.000 meter
function getAkomodasiTerkena(destLat, destLon, radiusMeters = 2000) {
  if (typeof dataHotel === 'undefined') return [];
  const list = [];
  dataHotel.features.forEach(h => {
    const hp = h.properties;
    const [hLon, hLat] = h.geometry.coordinates;
    const dist = getDistanceMeters(destLat, destLon, hLat, hLon);
    if (dist <= radiusMeters) {
      list.push({
        nama: hp.nama,
        tipe: hp.tipe,
        kategori: hp.kategori,
        alamat: hp.alamat,
        jarak_m: Math.round(dist),
        jarak_km: (dist / 1000).toFixed(2),
        lat: hLat,
        lng: hLon
      });
    }
  });
  list.sort((a, b) => a.jarak_m - b.jarak_m);
  return list;
}

// Bersihkan buffer titik destinasi aktif
function clearDestinationBuffer() {
  if (activeDestinationBuffer) {
    map.removeLayer(activeDestinationBuffer);
    activeDestinationBuffer = null;
  }
  if (activeConnectorGroup) {
    activeConnectorGroup.clearLayers();
  }
}

// Tampilkan buffer spesifik titik (warna Oranye menyala, SELALU DI ATAS buffer Cyan keseluruhan) & garis konektor
function showDestinationBuffer(destLat, destLon, destName, akomodasiList) {
  clearDestinationBuffer();

  // 1. Gambar Lingkaran Buffer Titik Ini (Radius 2.000 m, Warna Oranye Tegas)
  // Menggunakan custom pane 'activeDestinationPane' (zIndex 480) agar SELALU BERADA DI ATAS buffer Cyan keseluruhan (zIndex 400)
  activeDestinationBuffer = L.circle([destLat, destLon], {
    radius: 2000,
    pane: 'activeDestinationPane',
    fillColor: '#f97316',
    fillOpacity: 0.35,
    color: '#c2410c',
    weight: 3.5,
    dashArray: '6, 6'
  }).addTo(map);

  activeDestinationBuffer.bringToFront();

  activeDestinationBuffer.bindTooltip(`<strong>Buffer Jangkauan 2 Km</strong><br>${destName}`, {
    sticky: true,
    direction: 'top',
    pane: 'activeDestinationPane'
  });

  // 2. Gambar Garis Konektor (Oranye) ke setiap akomodasi yang terkena
  akomodasiList.forEach(a => {
    const line = L.polyline([[destLat, destLon], [a.lat, a.lng]], {
      pane: 'activeDestinationPane',
      color: '#ea580c',
      weight: 2.5,
      opacity: 0.95,
      dashArray: '4, 5'
    });
    line.bindTooltip(`${a.nama} (${a.jarak_m < 1000 ? a.jarak_m + ' m' : a.jarak_km + ' km'})`, {
      sticky: true,
      className: 'connector-tooltip'
    });
    activeConnectorGroup.addLayer(line);
  });
}

// Bersihkan buffer aktif saat popup ditutup di peta
map.on('popupclose', function() {
  clearDestinationBuffer();
});

function createWisataIcon(isCovered, kategori) {
  const pinClass = isCovered ? 'pin-wisata-covered' : 'pin-wisata-uncovered';
  let iconName = 'fa-umbrella-beach';
  if (kategori.includes('Budaya') || kategori.includes('Sejarah')) iconName = 'fa-monument';
  else if (kategori.includes('Alam')) iconName = 'fa-tree';
  else if (kategori.includes('Rekreasi')) iconName = 'fa-water';

  return L.divIcon({
    className: 'custom-pin-container',
    html: `<div class="custom-pin ${pinClass}" title="${isCovered ? 'Terjangkau Hotel' : 'Belum Terjangkau'}"><i class="fa-solid ${iconName}"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
}

function renderWisataMarkers(filterKategori = 'ALL', filterAkses = 'ALL') {
  layerWisataGroup.clearLayers();
  Object.keys(wisataMarkersMap).forEach(key => delete wisataMarkersMap[key]);

  if (typeof dataWisata === 'undefined') return;

  dataWisata.features.forEach(w => {
    const p = w.properties;

    // Filter kategori
    if (filterKategori !== 'ALL' && p.kategori !== filterKategori) return;

    // Filter aksesibilitas
    if (filterAkses === 'COVERED' && !p.terjangkau_hotel_2km) return;
    if (filterAkses === 'UNCOVERED' && p.terjangkau_hotel_2km) return;

    const marker = L.marker([p.latitude, p.longitude], {
      icon: createWisataIcon(p.terjangkau_hotel_2km, p.kategori)
    });

    // Hitung akomodasi yang terkena radius 2 km dari titik ini
    const akomodasiList = getAkomodasiTerkena(p.latitude, p.longitude, 2000);

    const statusBadge = p.terjangkau_hotel_2km
      ? `<div class="popup-alert success"><i class="fa-solid fa-circle-check"></i> Terjangkau Hotel (Radius ≤ 2 Km)</div>`
      : `<div class="popup-alert warning"><i class="fa-solid fa-triangle-exclamation"></i> Belum Terjangkau Hotel (> 2 Km)</div>`;

    // Buat daftar akomodasi terkena di popup
    let akomodasiSection = '';
    if (akomodasiList.length > 0) {
      const listItems = akomodasiList.map(a => {
        let iconClass = 'fa-hotel';
        let iconColor = '#0284c7';
        if (a.tipe === 'Wisma') {
          iconClass = 'fa-house-user';
          iconColor = '#6366f1';
        } else if (a.tipe === 'Penginapan') {
          iconClass = 'fa-bed';
          iconColor = '#0d9488';
        }
        const distLabel = a.jarak_m < 1000 ? `${a.jarak_m} m` : `${a.jarak_km} km`;
        return `
          <div class="reached-item" title="${a.kategori} - ${a.alamat}">
            <div class="reached-item-info">
              <i class="fa-solid ${iconClass}" style="color: ${iconColor};"></i>
              <span class="name">${a.nama}</span>
            </div>
            <span class="reached-item-dist">${distLabel}</span>
          </div>
        `;
      }).join('');

      akomodasiSection = `
        <div class="reached-section">
          <div class="reached-title">
            <span><i class="fa-solid fa-bullseye" style="color: #d97706;"></i> Akomodasi Terkena (≤ 2 km):</span>
            <span class="count-pill">${akomodasiList.length} Unit</span>
          </div>
          <div class="reached-list">
            ${listItems}
          </div>
          <div class="buffer-active-badge" style="background: #fff7ed; border-color: #fdba74; color: #9a3412;">
            <span><span class="dot" style="background: #ea580c; box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.35);"></span>Buffer Titik Ini Aktif (Oranye)</span>
            <span style="color:#c2410c; font-size:10px; font-weight:700;">Radius 2.000 m</span>
          </div>
        </div>
      `;
    } else {
      akomodasiSection = `
        <div class="reached-section">
          <div class="popup-alert warning" style="margin-bottom: 4px;">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div>
              <strong>Di Luar Radius Layanan 2 Km</strong><br>
              Akomodasi terdekat: <strong>${p.hotel_terdekat}</strong> (${p.jarak_ke_hotel_km} km)
            </div>
          </div>
          <div class="buffer-active-badge" style="background: #fff7ed; border-color: #fdba74; color: #9a3412;">
            <span><span class="dot" style="background: #ea580c; box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.35);"></span>Buffer Titik Ini Aktif (Oranye)</span>
            <span style="color:#c2410c; font-size:10px; font-weight:700;">Radius 2.000 m</span>
          </div>
        </div>
      `;
    }

    const popupContent = `
      <div class="popup-card popup-wisata-card">
        <div class="popup-header wisata">
          <span class="badge">${p.kategori}</span>
          <h3>${p.nama}</h3>
        </div>
        <div class="popup-body">
          ${statusBadge}
          <div class="popup-row">
            <span class="key">Kecamatan:</span>
            <span class="val">${p.kecamatan}</span>
          </div>
          <div class="popup-row">
            <span class="key">Tiket Masuk:</span>
            <span class="val" style="color: #059669;">${p.tiket}</span>
          </div>
          <div class="popup-row">
            <span class="key">Jam Operasional:</span>
            <span class="val">${p.jam_buka}</span>
          </div>
          <div class="popup-row">
            <span class="key">Alamat:</span>
            <span class="val" style="font-size: 11px;">${p.alamat}</span>
          </div>
          <div style="font-size: 11px; margin-top: 2px; color: #475569; line-height: 1.4;">
            ${p.deskripsi}
          </div>
          ${akomodasiSection}
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 330 });

    // Event listener saat marker diklik / popup dibuka
    marker.on('click', function() {
      showDestinationBuffer(p.latitude, p.longitude, p.nama, akomodasiList);
    });
    marker.on('popupopen', function() {
      showDestinationBuffer(p.latitude, p.longitude, p.nama, akomodasiList);
    });

    wisataMarkersMap[p.nama] = marker;
    layerWisataGroup.addLayer(marker);
  });
}

renderWisataMarkers();
layerWisataGroup.addTo(map);

/* ================= 7. LAYER CONTROL (TOP RIGHT) ================= */
const baseMaps = {
  "OpenStreetMap (Standar)": osm,
  "Esri Citra Satelit": esriSatelit,
  "Esri Topografi & Relief": esriTopo
};

// Layer Control di kanan atas hanya untuk memilih Peta Dasar (Basemaps)
L.control.layers(baseMaps, null, {
  position: 'topright',
  collapsed: true
}).addTo(map);

/* ================= 8. SIDEBAR CHECKBOX TOGGLES (ON / OFF) ================= */
function bindCheckboxLayer(checkboxId, layer) {
  const chk = document.getElementById(checkboxId);
  if (!chk || !layer) return;

  chk.addEventListener('change', function() {
    if (this.checked) {
      if (!map.hasLayer(layer)) map.addLayer(layer);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  });
}

bindCheckboxLayer('toggle-layer-kecamatan', layerKecamatan);
bindCheckboxLayer('toggle-layer-wisata', layerWisataGroup);
bindCheckboxLayer('toggle-layer-hotel', layerHotelBintangGroup);
bindCheckboxLayer('toggle-layer-wisma', layerWismaGroup);
bindCheckboxLayer('toggle-layer-penginapan', layerPenginapanGroup);
bindCheckboxLayer('toggle-layer-buffer', layerBuffer);

// Sinkronisasi tombol Buffer di navbar dengan checkbox di sidebar
const btnToggleBuffer = document.getElementById('btn-toggle-buffer');
const chkBuffer = document.getElementById('toggle-layer-buffer');

function setBufferVisibility(visible) {
  if (!layerBuffer) return;
  if (visible) {
    if (!map.hasLayer(layerBuffer)) map.addLayer(layerBuffer);
    if (chkBuffer) chkBuffer.checked = true;
    if (btnToggleBuffer) btnToggleBuffer.classList.add('primary');
  } else {
    if (map.hasLayer(layerBuffer)) map.removeLayer(layerBuffer);
    if (chkBuffer) chkBuffer.checked = false;
    if (btnToggleBuffer) btnToggleBuffer.classList.remove('primary');
  }
}

if (btnToggleBuffer) {
  btnToggleBuffer.addEventListener('click', () => {
    const isNowVisible = !map.hasLayer(layerBuffer);
    setBufferVisibility(isNowVisible);
  });
}

if (chkBuffer) {
  chkBuffer.addEventListener('change', () => {
    setBufferVisibility(chkBuffer.checked);
  });
}

/* ================= 8. COORDINATE TRACKER (BOTTOM CENTER) ================= */
const coordText = document.getElementById('coord-text');
map.on('mousemove', function(e) {
  if (coordText) {
    coordText.textContent = `Lat: ${e.latlng.lat.toFixed(5)} | Lng: ${e.latlng.lng.toFixed(5)}`;
  }
});

/* ================= 9. SEARCH BAR LOGIC ================= */
const inputSearch = document.getElementById('input-search');
const searchResults = document.getElementById('search-results');

if (inputSearch && searchResults) {
  inputSearch.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }

    const matches = [];

    // Cari di wisata
    if (typeof dataWisata !== 'undefined') {
      dataWisata.features.forEach(w => {
        if (w.properties.nama.toLowerCase().includes(query) || w.properties.kategori.toLowerCase().includes(query)) {
          matches.push({
            name: w.properties.nama,
            cat: `Wisata &bull; ${w.properties.kategori}`,
            lat: w.properties.latitude,
            lng: w.properties.longitude
          });
        }
      });
    }

    // Cari di hotel
    if (typeof dataHotel !== 'undefined') {
      dataHotel.features.forEach(h => {
        if (h.properties.nama.toLowerCase().includes(query)) {
          matches.push({
            name: h.properties.nama,
            cat: `Hotel &bull; ${h.properties.kategori}`,
            lat: h.properties.latitude,
            lng: h.properties.longitude
          });
        }
      });
    }

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-item"><span class="cat">Tidak ada hasil ditemukan</span></div>`;
    } else {
      matches.slice(0, 6).forEach(m => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerHTML = `<span class="name">${m.name}</span><span class="cat">${m.cat}</span>`;
        item.addEventListener('click', function() {
          map.flyTo([m.lat, m.lng], 16, { duration: 1.2 });
          searchResults.style.display = 'none';
          inputSearch.value = m.name;
          if (wisataMarkersMap[m.name]) {
            setTimeout(() => {
              wisataMarkersMap[m.name].openPopup();
            }, 700);
          }
        });
        searchResults.appendChild(item);
      });
    }

    searchResults.style.display = 'block';
  });

  // Tutup dropdown search saat klik di luar
  document.addEventListener('click', function(e) {
    if (!document.getElementById('map-search-bar').contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
}

/* ================= 10. FILTER EVENT LISTENERS ================= */
const filterKategori = document.getElementById('filter-kategori');
const filterAkses = document.getElementById('filter-aksesibilitas');

function applyFilters() {
  const kat = filterKategori ? filterKategori.value : 'ALL';
  const aks = filterAkses ? filterAkses.value : 'ALL';
  renderWisataMarkers(kat, aks);
}

if (filterKategori) filterKategori.addEventListener('change', applyFilters);
if (filterAkses) filterAkses.addEventListener('change', applyFilters);

/* ================= 11. QUICK ZOOM KECAMATAN ================= */
document.querySelectorAll('.chip-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const kecName = this.getAttribute('data-kec');
    if (kecName === 'Kota Parepare') {
      map.flyTo(mapCenter, initialZoom);
    } else if (layerKecamatan) {
      layerKecamatan.eachLayer(l => {
        if (l.feature.properties.kecamatan === kecName) {
          map.fitBounds(l.getBounds(), { padding: [30, 30] });
          l.openPopup();
        }
      });
    }
  });
});

/* ================= 12. NAVBAR BUTTONS ================= */
const btnReset = document.getElementById('btn-reset-view');
if (btnReset) {
  btnReset.addEventListener('click', () => {
    map.flyTo(mapCenter, initialZoom);
  });
}

/* ================= 13. SIDEBAR TOGGLE ================= */
const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const btnCloseSidebar = document.getElementById('btn-close-sidebar');

if (btnToggleSidebar && sidebar) {
  btnToggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
}

if (btnCloseSidebar && sidebar) {
  btnCloseSidebar.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
  });
}

/* ================= 14. LEGENDA TOGGLE ================= */
const legendHeader = document.getElementById('legend-header');
const legendBody = document.getElementById('legend-body');
const legendChevron = document.getElementById('legend-chevron');

if (legendHeader && legendBody) {
  legendHeader.addEventListener('click', () => {
    const isHidden = legendBody.style.display === 'none';
    legendBody.style.display = isHidden ? 'flex' : 'none';
    if (legendChevron) {
      legendChevron.className = isHidden ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up';
    }
  });
}

/* ================= 15. CHART.JS INITIALIZATION ================= */
function initCharts() {
  if (typeof Chart === 'undefined' || typeof dataSummary === 'undefined') return;

  const rekap = dataSummary.rekap_per_kecamatan;
  const labels = rekap.map(r => r.kecamatan);
  const dataWisataVal = rekap.map(r => r.jumlah_wisata);
  const dataHotelVal = rekap.map(r => r.hotel_bintang || 0);
  const dataWismaVal = rekap.map(r => r.wisma || 0);
  const dataPenginapanVal = rekap.map(r => r.penginapan || 0);

  const totalWisataCount = typeof dataWisata !== 'undefined' ? dataWisata.features.length : 32;
  const totalHotelCount = typeof dataHotel !== 'undefined' ? dataHotel.features.filter(h => h.properties.tipe === 'Hotel').length : 10;
  const totalWismaCount = typeof dataHotel !== 'undefined' ? dataHotel.features.filter(h => h.properties.tipe === 'Wisma').length : 7;
  const totalPenginapanCount = typeof dataHotel !== 'undefined' ? dataHotel.features.filter(h => h.properties.tipe === 'Penginapan').length : 5;

  // 1. Bar Chart: Wisata vs Komposisi Akomodasi (Dual-Stack per Kecamatan)
  const ctxBar = document.getElementById('chart-kecamatan');
  if (ctxBar) {
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: `Wisata (${totalWisataCount})`,
            data: dataWisataVal,
            backgroundColor: '#10b981',
            stack: 'wisata',
            borderRadius: 6,
            barPercentage: 0.8,
            categoryPercentage: 0.8
          },
          {
            label: `Hotel (${totalHotelCount})`,
            data: dataHotelVal,
            backgroundColor: '#0284c7',
            stack: 'akomodasi',
            borderRadius: 4,
            barPercentage: 0.8,
            categoryPercentage: 0.8
          },
          {
            label: `Wisma (${totalWismaCount})`,
            data: dataWismaVal,
            backgroundColor: '#8b5cf6',
            stack: 'akomodasi',
            borderRadius: 4,
            barPercentage: 0.8,
            categoryPercentage: 0.8
          },
          {
            label: `Penginapan (${totalPenginapanCount})`,
            data: dataPenginapanVal,
            backgroundColor: '#0d9488',
            stack: 'akomodasi',
            borderRadius: 4,
            barPercentage: 0.8,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, font: { size: 9.5 }, padding: 8 }
          },
          tooltip: {
            callbacks: {
              afterBody: function(context) {
                const idx = context[0].dataIndex;
                const r = rekap[idx];
                return `Total Akomodasi: ${r.total_akomodasi} Unit`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { font: { size: 10, weight: '600' } },
            grid: { display: false }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 2, font: { size: 9 } },
            title: { display: true, text: 'Jumlah Unit / Objek', font: { size: 9.5 } }
          }
        }
      }
    });
  }

  // 2. Doughnut Chart: Rasio Aksesibilitas
  const ctxDonut = document.getElementById('chart-aksesibilitas');
  if (ctxDonut) {
    const terjangkau = dataSummary.hasil_keseluruhan.wisata_terjangkau_radius_2km;
    const belum = dataSummary.hasil_keseluruhan.wisata_belum_terjangkau_radius_2km;

    new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: ['Terjangkau (≤ 2 km)', 'Belum Terjangkau (> 2 km)'],
        datasets: [{
          data: [terjangkau, belum],
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        },
        cutout: '65%'
      }
    });
  }
}

// Inisialisasi Grafik saat dokumen selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  initCharts();

  // Cek URL parameter jika dibuka dari tombol "Peta" pada tabel_atribut.html
  const urlParams = new URLSearchParams(window.location.search);
  const paramLat = parseFloat(urlParams.get('lat'));
  const paramLng = parseFloat(urlParams.get('lng'));
  const paramName = urlParams.get('name');

  if (!isNaN(paramLat) && !isNaN(paramLng)) {
    setTimeout(() => {
      map.flyTo([paramLat, paramLng], 16, { duration: 1.2 });
      if (paramName && wisataMarkersMap[paramName]) {
        setTimeout(() => {
          wisataMarkersMap[paramName].openPopup();
        }, 800);
      }
    }, 500);
  }
});
