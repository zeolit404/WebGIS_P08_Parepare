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

/* ================= 2. DATA LAYERS & GROUPS ================= */
let layerKecamatan;
let layerBuffer;
const layerWisataGroup = L.layerGroup();
const layerHotelGroup = L.layerGroup();

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
function createHotelIcon() {
  return L.divIcon({
    className: 'custom-pin-container',
    html: `<div class="custom-pin pin-hotel" title="Hotel / Akomodasi"><i class="fa-solid fa-hotel"></i></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
}

if (typeof dataHotel !== 'undefined') {
  dataHotel.features.forEach(h => {
    const p = h.properties;
    const marker = L.marker([p.latitude, p.longitude], {
      icon: createHotelIcon()
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
    layerHotelGroup.addLayer(marker);
  });
  layerHotelGroup.addTo(map);
}

/* ================= 6. LAYER WISATA (DENGAN FILTER & STATUS AKSES) ================= */
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

    const statusBadge = p.terjangkau_hotel_2km
      ? `<div class="popup-alert success"><i class="fa-solid fa-circle-check"></i> Terjangkau Hotel (Radius ≤ 2 Km)</div>`
      : `<div class="popup-alert warning"><i class="fa-solid fa-triangle-exclamation"></i> Belum Terjangkau Hotel (> 2 Km)</div>`;

    const popupContent = `
      <div class="popup-card">
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
            <span class="key">Hotel Terdekat:</span>
            <span class="val">${p.hotel_terdekat}</span>
          </div>
          <div class="popup-row">
            <span class="key">Jarak ke Hotel:</span>
            <span class="val"><strong>${p.jarak_ke_hotel_km} km</strong> (${p.jarak_ke_hotel_m.toLocaleString('id-ID')} m)</span>
          </div>
          <div style="font-size: 11px; margin-top: 4px; color: #475569;">
            ${p.deskripsi}
          </div>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent);
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

const overlayMaps = {
  "Batas Administrasi Kecamatan": layerKecamatan,
  "Titik Objek Wisata": layerWisataGroup,
  "Titik Hotel & Akomodasi": layerHotelGroup,
  "Area Jangkauan Hotel (Radius 2 Km)": layerBuffer
};

L.control.layers(baseMaps, overlayMaps, {
  position: 'topright',
  collapsed: true
}).addTo(map);

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

const btnToggleBuffer = document.getElementById('btn-toggle-buffer');
if (btnToggleBuffer && layerBuffer) {
  let bufferVisible = true;
  btnToggleBuffer.addEventListener('click', () => {
    bufferVisible = !bufferVisible;
    if (bufferVisible) {
      map.addLayer(layerBuffer);
      btnToggleBuffer.classList.add('primary');
    } else {
      map.removeLayer(layerBuffer);
      btnToggleBuffer.classList.remove('primary');
    }
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
  const dataHotelVal = rekap.map(r => r.jumlah_hotel);

  // 1. Bar Chart: Wisata vs Hotel
  const ctxBar = document.getElementById('chart-kecamatan');
  if (ctxBar) {
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Wisata',
            data: dataWisataVal,
            backgroundColor: '#10b981',
            borderRadius: 6
          },
          {
            label: 'Hotel',
            data: dataHotelVal,
            backgroundColor: '#0284c7',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 9 } } },
          x: { ticks: { font: { size: 9 } } }
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
window.addEventListener('DOMContentLoaded', initCharts);
