# BAHAN LAPORAN PRAKTIKUM PERTEMUAN 08 (P08) UNTUK CLAUDE
## Lampiran A: Lembar Tugas Mahasiswa

Dokumen ini disusun untuk memudahkan pembuatan laporan akhir di Claude sesuai template resmi pada **Tugas_P08.pdf (Halaman 5–8)**.

---

### A0. Identitas
| Isian | Jawaban |
|:---|:---|
| **Nama / NIM** | M. ARIEF ABDILLAH / V126241003 |
| **Judul WebGIS** | WebGIS Analisis Spasial Aksesibilitas Destinasi Wisata terhadap Hotel (Radius 2 Km) di Kota Parepare |
| **Wilayah** | Kota Parepare, Sulawesi Selatan (4 Kecamatan: Bacukiki, Bacukiki Barat, Soreang, Ujung) |
| **Cara yang dipilih** | Jalur A (Dengan Coding: HTML5, CSS3, JavaScript, Leaflet.js, Turf.js, Chart.js, Node.js) |
| **Alamat / Tautan WebGIS** | `http://localhost:3000` (Lokal) / GitHub Pages repository: `WebGIS_P08_Parepare` |

---

### A1. Tahap 1 &mdash; Tujuan dan Pertanyaan
| Isian | Jawaban |
|:---|:---|
| **Tujuan (1 kalimat)** | Menganalisis jangkauan aksesibilitas spasial fasilitas akomodasi hotel terhadap sebaran destinasi wisata di Kota Parepare menggunakan analisis buffer radius 2 kilometer guna memetakan kawasan wisata yang telah terlayani dan mendeteksi area *blank spot*. |
| **Pengguna sasaran** | Dinas Kepemudaan, Olahraga, dan Pariwisata (Disporapar) Kota Parepare, PHRI, investor perhotelan, wisatawan, dan akademisi perencana wilayah. |
| **Pertanyaan 1** | Berapa persentase destinasi wisata di Kota Parepare yang terjangkau oleh fasilitas akomodasi hotel dalam radius 2 km? |
| **Pertanyaan 2** | Kecamatan mana yang memiliki tingkat keterjangkauan akomodasi tertinggi dan di mana letak *blank spot* yang belum memiliki hotel terdekat? |
| **Pertanyaan 3 (opsional)** | Hotel mana yang menjadi akomodasi terdekat dan berapa jarak riilnya ke masing-masing objek wisata di Kota Parepare? |

---

### A2. Tahap 2 &mdash; Pilihan Platform
| Isian | Jawaban |
|:---|:---|
| **Platform/alat yang dipakai** | Node.js, Leaflet.js (v1.9.4), Turf.js (Spatial Analysis Library), Chart.js, HTML5, CSS3 Glassmorphism. |
| **Alasan memilih** | Sesuai pohon keputusan Modul Gambar 4, Jalur A dipilih karena memerlukan **analisis spasial dinamis** (geodesic buffer 2 km), perhitungan jarak otomatis titik wisata ke hotel terdekat, serta visualisasi grafik statistik terhubung (Chart.js) yang tidak kaku. |
| **Kekurangan platform ini** | Memerlukan pemahaman penulisan kode JavaScript dan manipulasi DOM secara manual dibandingkan alat no-code (seperti qgis2web), namun kelebihannya fleksibilitas desain dan kontrol fitur interaktif sangat tinggi. |

---

### A3. Tahap 3 &mdash; Data yang Dikumpulkan
| No | Nama Layer | Jenis Geometri | Sumber & Tahun | Cara Memperoleh | Lisensi |
|:---:|:---|:---:|:---|:---|:---|
| 1 | Batas Administrasi Kecamatan | Polygon (4 fitur) | Ina-Geoportal Badan Informasi Geospasial (BIG), 2024 | Unduh data vektor RBI skala 1:50.000 via portal tanahair.indonesia.go.id | Lisensi Data Terbuka BIG |
| 2 | Data Demografi & Kewilayahan | Tabular | BPS Kota Parepare ("Kota Parepare Dalam Angka 2024") | Unduh publikasi resmi BPS Kota Parepare | Terbuka / BPS |
| 3 | Titik Destinasi Wisata | Point (12 fitur) | OpenStreetMap (OSM) & Disporapar Parepare (2024/2025) | Ekstraksi titik pariwisata via Nominatim/OSM dan verifikasi koordinat | Open Database License (ODbL) |
| 4 | Titik Hotel & Akomodasi | Point (10 fitur) | OpenStreetMap (OSM) & PHRI Parepare (2024/2025) | Ekstraksi POI perhotelan dari OSM dan verifikasi lapangan digital | Open Database License (ODbL) |
| 5 | Buffer Jangkauan Hotel (2 Km) | MultiPolygon | Hasil Olahan Analisis Spasial (Turf.js) | Geodesic buffer 2.000 meter terhadap titik hotel | Data Hasil Analisis |

---

### A4. Tahap 4 &mdash; Merapikan Data
| Pemeriksaan | Hasil / Tindakan yang Dilakukan |
|:---|:---|
| **CRS seluruh layer** | Seluruh data diseragamkan ke sistem koordinat geografis **WGS84 (EPSG:4326)** agar sesuai standar Leaflet dan GeoJSON. |
| **Validitas geometri** | Memeriksa ring poligon kecamatan tertutup sempurna tanpa self-intersection, titik koordinat berada di dalam rentang koordinat Parepare (Lat: -4.08 s.d -3.96, Lon: 119.61 s.d 119.72). |
| **Nama & tipe kolom** | Standardisasi nama field: `kecamatan` (String), `luas_km2` (Float), `penduduk_jiwa` (Integer), `kategori` (String), `hotel_terdekat` (String), `jarak_ke_hotel_km` (Float). |
| **Duplikat / data kosong** | Menghapus 19 kolom null bawaan shapefile lawas (KDPPUM, FCODE, KDEBPS, dll.) dan memverifikasi tidak ada data ganda (0 duplicate). |
| **Kunci penggabung tabel** | Field `kecamatan` digunakan sebagai *relational key* antara data polygon batas wilayah dengan data atribut demografi BPS. |
| **Tempat penyimpanan** | Disimpan di folder proyek: `WebGIS_P08_Parepare/data/` dalam format `.geojson` dan `.js` (dual-loading CORS-free). Data mentah asli disimpan di `data/raw/`. |

---

### A5. Tahap 5 &mdash; Analisis Spasial
| Isian | Jawaban |
|:---|:---|
| **Nama analisis** | Analisis Buffer Aksesibilitas Fasilitas Akomodasi (Radius 2 Km) & Point-in-Polygon Keterjangkauan Wisata. |
| **Alat/fungsi yang dipakai** | `turf.buffer(point, 2, {units: 'kilometers'})`, `turf.union()`, dan `turf.distance()` (Haversine formula). |
| **Langkah atau kode SQL/JS** | 1. Membuat buffer 2 km dari setiap titik hotel.<br>2. Menggabungkan (union) seluruh buffer menjadi *service coverage area*.<br>3. Menghitung jarak geodesik setiap objek wisata ke hotel terdekat.<br>4. Mengklasifikasi: Terjangkau (≤ 2 km) vs Belum Terjangkau (> 2 km). |
| **Hasil utama (angka penting)** | &bull; Total Objek Wisata: **12 destinasi**.<br>&bull; Wisata Terjangkau Hotel (≤ 2 km): **8 objek (66,7% &asymp; 67%)**.<br>&bull; Wisata Belum Terjangkau Hotel (> 2 km): **4 objek (33,3% &asymp; 33%)**.<br>&bull; Rekap per kecamatan: Ujung (100% terjangkau, 6 hotel), Bacukiki Barat (100% terjangkau, 3 hotel), Soreang (67% terjangkau, 1 hotel), Bacukiki (0% terjangkau, 0 hotel &mdash; **Blank Spot**). |
| **Cara memastikan hasil benar** | Memvalidasi jarak lurus manual di peta menggunakan skala metrik dan cross-check dengan koordinat Haversine formula. |

---

### A6. Tahap 6 &mdash; Penyajian Data
| Isian | Jawaban |
|:---|:---|
| **Bentuk penyajian** | WebGIS berbasis Node.js Server (`http://localhost:3000`) dan Static Web Client (bisa dibuka langsung via file `index.html` dan siap hosting di GitHub Pages). |
| **Langkah singkat** | 1. Menyiapkan bundel data GeoJSON dan variabel JavaScript (`.js`).<br>2. Menyiapkan layout HTML5 glassmorphism dengan Leaflet.js.<br>3. Mengatur layer group dan styling kustom.<br>4. Menjalankan server HTTP ringan via Node.js (`server.js`). |

---

### A7. Tahap 7 &mdash; Visualisasi
| Elemen Wajib | Ada? (✓/✗) | Keterangan |
|:---|:---:|:---|
| **Basemap** | ✓ | 3 Pilihan: OpenStreetMap Standar, Esri Citra Satelit, Esri Topografi & Relief. |
| **Warna/simbol bermakna** | ✓ | Pin hijau = Wisata Terjangkau, Pin merah = Belum Terjangkau, Pin biru = Hotel, Area cyan transparan = Buffer 2 Km. |
| **Popup berlabel** | ✓ | Menampilkan detail objek, tarif, jam buka, nama hotel terdekat, dan jarak riil (meter & km). |
| **Legenda** | ✓ | Panel legenda di kanan bawah dengan tombol minimize/expand. |
| **Judul** | ✓ | Tampil elegan di navbar atas lengkap dengan badge P08. |
| **Sumber data** | ✓ | Dicantumkan di footer sidebar, popup, dan README. |
| **Fitur interaktif 1** | ✓ | **Pencarian Cepat (Search Bar)** dengan fitur *flyTo* zoom otomatis ke lokasi objek. |
| **Fitur interaktif 2** | ✓ | **Filter Ganda** berdasarkan kategori objek wisata dan status keterjangkauan hotel. |
| **Panel statistik/grafik** | ✓ | Dashboard Chart.js interaktif: Bar Chart sebaran fasilitas dan Donut Chart rasio keterjangkauan. |

---

### A8. Tahap 8 &mdash; Uji & Publikasi
| Uji | Hasil |
|:---|:---|
| **Dibuka di browser lain** | Berhasil diuji pada Microsoft Edge, Google Chrome, dan Mozilla Firefox dengan tampilan konsisten. |
| **Dibuka di HP / layar kecil** | Responsif: Navbar menyesuaikan ukuran, sidebar dapat di-collapse, panel kontrol tetap mudah diakses. |
| **Angka di WebGIS = hasil analisis** | Sinkron 100%: Total 12 wisata, 8 terjangkau (67%), 4 belum terjangkau (33%), 10 hotel. |
| **Alamat publik (jika diunggah)** | `http://localhost:3000` (Lokal) / GitHub Pages repository. |
| **Tautan video demo** | Diisi tautan video rekaman layar (≤ 3 menit). |

---

### A9. Interpretasi dan Refleksi
* **Jawaban atas pertanyaan di A1**:
  Sebanyak **66,7% (8 destinasi)** wisata di Kota Parepare sudah memiliki aksesibilitas akomodasi yang sangat baik dalam radius 2 km, terkonsentrasi di kawasan pesisir dan perkotaan (Kecamatan Ujung dan Bacukiki Barat). Namun, terdapat kesenjangan signifikan di **Kecamatan Bacukiki**, di mana ketiga destinasi wisatanya (Ladoma, Salatiga Hills, Waterboom) berada di luar radius 2 km dari hotel manapun (0% terlayani). Hal ini menunjukkan potensi besar pengembangan homestay atau *resort* berbasis alam di Bacukiki.
* **Kendala terbesar & cara mengatasinya**:
  Kendala ketersediaan data spasial batas kecamatan yang bersih diatasi dengan mengonversi dan memfilter shapefile resmi Ina-Geoportal BIG dari 8 kecamatan regional menjadi 4 kecamatan murni Kota Parepare, serta menyatukan atribut demografi BPS secara otomatis melalui skrip Node.js.
* **Jika diberi waktu lebih, apa yang ingin ditambahkan?**:
  Menambahkan analisis rute jaringan jalan riil (*Network Analysis / Isochrone travel time*) dengan memperhitungkan waktu tempuh berkendara, serta integrasi foto 360° destinasi wisata.
