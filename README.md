# WebGIS Analisis Spasial Aksesibilitas Destinasi Wisata terhadap Hotel (Radius 2 Km) di Kota Parepare

Proyek tugas mandiri praktikum Pertemuan 08 (P08) mata kuliah **Praktek Pengelolaan Big Data dan WebGIS**, Program Studi D4 Penginderaan Jauh dan Sistem Informasi Geografis, Fakultas Vokasi, Universitas Hasanuddin.

---

## Identitas Mahasiswa & Tugas
* **Nama**: M. ARIEF ABDILLAH
* **NIM**: V126241003
* **Program Studi**: D4 Penginderaan Jauh & Sistem Informasi Geografis
* **Fakultas**: Fakultas Vokasi, Universitas Hasanuddin
* **Mata Kuliah**: Praktek Pengelolaan BIG Data dan WebGIS (24V12630303) &mdash; 3 SKS
* **Dosen Pengampu**: Andang Suryana Soma, S.Hut., M.P., Ph.D.
* **Metode Pembuatan**: Jalur A (Coding: HTML5, CSS3, JavaScript, Leaflet.js, Turf.js, Chart.js)

---

## 1. Tujuan & Pertanyaan Analisis Spasial
### Tujuan:
Menganalisis jangkauan aksesibilitas spasial fasilitas akomodasi (hotel/penginapan) terhadap sebaran destinasi wisata di Kota Parepare menggunakan analisis *geodesic buffer radius 2 kilometer* guna mengidentifikasi destinasi yang telah terlayani dengan baik serta mendeteksi area *blank spot* akomodasi.

### Pertanyaan Spasial:
1. Berapa persentase destinasi wisata di Kota Parepare yang berada di dalam radius jangkauan layanan hotel (≤ 2 km)?
2. Di kecamatan mana saja terdapat kesenjangan (*blank spot*) antara sebaran destinasi wisata dengan ketersediaan akomodasi hotel?
3. Hotel manakah yang menjadi akomodasi terdekat dan berapa jarak riilnya untuk masing-masing destinasi wisata?

---

## 2. Sumber Data Spasial & Atribut

| No | Layer Data | Tipe Geometri | Sumber & Tahun | Lisensi |
|:---:|:---|:---:|:---|:---:|
| 1 | **Batas Administrasi Kecamatan** | Polygon (4 Fitur) | Ina-Geoportal Badan Informasi Geospasial (BIG) Skala 1:50.000 | Lisensi Data Terbuka BIG |
| 2 | **Data Demografi & Wilayah** | Atribut Tabular | BPS Kota Parepare ("Kota Parepare Dalam Angka 2024") | BPS Indonesia |
| 3 | **Titik Objek Wisata** | Point (12 Fitur) | OpenStreetMap Contributors & Disporapar Kota Parepare (2024/2025) | Open Database License (ODbL) |
| 4 | **Titik Hotel & Akomodasi** | Point (10 Fitur) | OpenStreetMap Contributors & PHRI Kota Parepare (2024/2025) | Open Database License (ODbL) |
| 5 | **Area Buffer Hotel (2 Km)** | MultiPolygon / Polygon | Hasil Analisis Geodesic Buffer (Turf.js) | Data Olahan Mahasiswa |

---

## 3. Hasil Analisis Spasial Utama (Radius 2 Km)

* **Total Destinasi Wisata**: 12 Objek
* **Total Akomodasi Hotel**: 10 Hotel
* **Wisata Terjangkau Hotel (≤ 2 km)**: **8 Objek (66,7% &asymp; 67%)**
* **Wisata Belum Terjangkau Hotel (> 2 km)**: **4 Objek (33,3% &asymp; 33%)**

### Rekapitulasi per Kecamatan:
1. **Kecamatan Ujung**: 
   * Wisata: 3 (Semua terjangkau 100%)
   * Hotel: 6 unit
   * *Analisis*: Merupakan pusat kota dan kawasan pelabuhan dengan konsentrasi hotel tertinggi.
2. **Kecamatan Bacukiki Barat**: 
   * Wisata: 3 (Semua terjangkau 100%)
   * Hotel: 3 unit
   * *Analisis*: Kawasan pesisir wisata bahari (Pantai Mattirotasi, TRS, Pantai Lumpue) memiliki aksesibilitas akomodasi yang sangat prima.
3. **Kecamatan Soreang**: 
   * Wisata: 3 (2 terjangkau / 67%, 1 belum terjangkau)
   * Hotel: 1 unit
   * *Analisis*: Memiliki wisata hutan kota (Kebun Raya Jompie) dan anjungan pesisir.
4. **Kecamatan Bacukiki**: 
   * Wisata: 3 (0 terjangkau / 0%)
   * Hotel: 0 unit
   * *Analisis*: Merupakan area pedalaman dengan potensi agrowisata dan ekowisata alam (Ladoma, Salatiga Hills, Waterboom), namun menjadi **blank spot** utama karena ketiadaan hotel dalam radius 2 km.

---

## 4. Fitur Interaktif WebGIS
1. **Pilihan Basemap**: OpenStreetMap Standar, Esri Citra Satelit, Esri Topografi & Relief.
2. **Layer Control Dinamis**: Toggle layer batas kecamatan, titik wisata, titik hotel, dan area buffer 2 km.
3. **Pencarian Cepat (Search Bar)**: Auto-complete pencarian nama wisata, hotel, dan kecamatan dengan fitur *flyTo*.
4. **Filter Wisata Ganda**: Filter berdasarkan kategori objek wisata (Bahari, Budaya, Alam, Sejarah, Rekreasi) dan status aksesibilitas (Terjangkau vs Belum Terjangkau).
5. **Dashboard Statistik Spasial**: Grafik batang distribusi wisata & hotel per kecamatan serta grafik donat rasio keterjangkauan berbasis Chart.js.
6. **Quick Zoom Chips**: Tombol navigasi langsung ke masing-masing kecamatan.
7. **Coordinate Tracker & Scale Bar**: Penunjuk koordinat cursor *real-time* (Lat/Lng) dan skala metrik.
8. **Popup Interaktif**: Menampilkan nama hotel terdekat, jarak akurat dalam meter/kilometer, tarif tiket, jam operasional, dan status keterjangkauan.

---

## 5. Cara Menjalankan Aplikasi

### Opsi 1: Menjalankan via Node.js Server (Lokal)
```bash
npm start
```
Buka peramban (browser) di alamat: `http://localhost:3000`

### Opsi 2: Membuka Langsung File HTML
Buka file `index.html` langsung di browser apapun (Chrome, Edge, Firefox). File data telah menggunakan sistem *dual-loading* sehingga bebas kendala CORS.
