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

### Tautan Publikasi WebGIS:
* **Live WebGIS (GitHub Pages)**: [https://zeolit404.github.io/WebGIS_P08_Parepare/](https://zeolit404.github.io/WebGIS_P08_Parepare/)
* **Halaman Tabel Atribut Spasial**: [https://zeolit404.github.io/WebGIS_P08_Parepare/tabel_atribut.html](https://zeolit404.github.io/WebGIS_P08_Parepare/tabel_atribut.html)
* **Repositori GitHub**: [https://github.com/zeolit404/WebGIS_P08_Parepare](https://github.com/zeolit404/WebGIS_P08_Parepare)

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
| 3 | **Titik Objek Wisata** | Point (32 Fitur) | OpenStreetMap Contributors & Disporapar Kota Parepare (2024/2025) | Open Database License (ODbL) |
| 4 | **Titik Akomodasi (Hotel, Wisma, Penginapan)** | Point (22 Fitur) | OpenStreetMap Contributors, PHRI & Direktori Penginapan (2024/2025) | Open Database License (ODbL) |
| 5 | **Area Buffer Akomodasi (2 Km)** | MultiPolygon / Polygon | Hasil Analisis Geodesic Buffer (Turf.js) | Data Olahan Mahasiswa |

---

## 3. Hasil Analisis Spasial Utama (Radius 2 Km)

* **Total Destinasi Wisata**: 32 Objek
* **Total Akomodasi**: 22 Unit (10 Hotel Bintang & Melati, 7 Wisma & Guest House, 5 Penginapan & Homestay)
* **Wisata Terjangkau Akomodasi (≤ 2 km)**: **28 Objek (87,5% &asymp; 88%)**
* **Wisata Belum Terjangkau Akomodasi (> 2 km)**: **4 Objek (12,5% &asymp; 12%)**

### Rekapitulasi per Kecamatan:
1. **Kecamatan Ujung**: 
   * Wisata: 10 (Semua terjangkau 100%)
   * Akomodasi: 11 unit (6 Hotel, 3 Wisma, 2 Penginapan)
   * *Analisis*: Pusat kota dan kawasan pelabuhan dengan konsentrasi akomodasi tertinggi.
2. **Kecamatan Bacukiki Barat**: 
   * Wisata: 9 (Semua terjangkau 100%)
   * Akomodasi: 6 unit (3 Hotel, 3 Wisma)
   * *Analisis*: Kawasan pesisir wisata bahari prima (Pantai Mattirotasi, TRS, Pantai Lumpue, Pantai Paputo, Tebing Lumpue) terlayani optimal.
3. **Kecamatan Soreang**: 
   * Wisata: 4 (Semua terjangkau 100%)
   * Akomodasi: 3 unit (1 Hotel, 1 Wisma, 1 Penginapan)
   * *Analisis*: Wisata alam hutan kota (Kebun Raya Jompie), Anjungan Cempae, dan Taman Syariah terjangkau baik.
4. **Kecamatan Bacukiki**: 
   * Wisata: 9 (5 terjangkau / 56%, 4 belum terjangkau / 44%)
   * Akomodasi: 2 unit (Penginapan/Homestay pedesaan)
   * *Analisis*: Wilayah perbukitan dan lembah pedalaman. Objek wisata pedalaman (Salatiga Hills, Bendungan Lappa Angin, Puncak Bili-Bili, Pemandian Bulu Langi) berada di luar buffer 2 km dan berpotensi besar untuk investasi *eco-lodge* / *glamping*.

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
