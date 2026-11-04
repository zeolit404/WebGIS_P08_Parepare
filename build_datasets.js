const fs = require('fs');
const turf = require('@turf/turf');

// 1. DATA REAL DESTINASI WISATA KOTA PAREPARE (12 TITIK)
const rawWisata = [
  {
    id: 1,
    nama: "Monumen Cinta Sejati Habibie-Ainun",
    kategori: "Budaya & Landmark",
    kecamatan: "Ujung",
    alamat: "Jl. Karaeng Burane, Mallusetasi, Kec. Ujung, Kota Parepare",
    latitude: -4.012608,
    longitude: 119.621994,
    jam_buka: "24 Jam",
    tiket: "Gratis",
    deskripsi: "Monumen perunggu ikonik mengenang kisah cinta Presiden ke-3 RI B.J. Habibie dan Hasri Ainun Habibie di pusat kota Parepare.",
    fasilitas: "Spot Foto, Taman Terbuka, Bangku Taman, Area Kuliner"
  },
  {
    id: 2,
    nama: "Pantai & Taman Mattirotasi",
    kategori: "Bahari & Pantai",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Mattirotasi, Kp. Baru, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.021354,
    longitude: 119.622939,
    jam_buka: "24 Jam",
    tiket: "Gratis",
    deskripsi: "Kawasan pesisir pantai dengan jogging track sepanjang teluk Parepare, gazebo santai, dan panorama matahari terbenam (sunset) Selat Makassar.",
    fasilitas: "Jogging Track, Gazebo, Tempat Duduk, Kuliner Seafood"
  },
  {
    id: 3,
    nama: "Tonrangeng River Side (TRS)",
    kategori: "Rekreasi & Bahari",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Tonrangeng, Lumpue, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.032100,
    longitude: 119.626400,
    jam_buka: "06.00 - 22.00 WITA",
    tiket: "Gratis",
    deskripsi: "Kawasan wisata tepi muara sungai dan laut dengan jembatan layang pejalan kaki megah, pusat kuliner, dan terhubung ke RS Regional Hasri Ainun Habibie.",
    fasilitas: "Jembatan Layang, Kuliner Bahari, Musholla, Toilet, Parkir Luas"
  },
  {
    id: 4,
    nama: "Kebun Raya Jompie (Hutan Wisata Jompie)",
    kategori: "Alam & Ekowisata",
    kecamatan: "Soreang",
    alamat: "Jl. Pahlawan, Bukit Harapan, Kec. Soreang, Kota Parepare",
    latitude: -3.997453,
    longitude: 119.640914,
    jam_buka: "08.00 - 17.00 WITA",
    tiket: "Rp 5.000 / orang",
    deskripsi: "Kawasan hutan kota seluas 13,5 hektar dengan keanekaragaman flora endemik Wallacea, kolam renang alami, menara pandang, dan camping ground.",
    fasilitas: "Menara Pandang, Jalur Treking, Kolam Renang, Camping Ground, Musholla"
  },
  {
    id: 5,
    nama: "Monumen Korban 40.000 Jiwa",
    kategori: "Sejarah & Edukasi",
    kecamatan: "Ujung",
    alamat: "Jl. Veteran No.1, Mallusetasi, Kec. Ujung, Kota Parepare",
    latitude: -4.008950,
    longitude: 119.622002,
    jam_buka: "24 Jam",
    tiket: "Gratis",
    deskripsi: "Monumen peringatan bersejarah mengenang korban pembantaian pejuang Sulawesi Selatan oleh pasukan Raymond Westerling tahun 1946-1947.",
    fasilitas: "Plakat Sejarah, Area Penghijauan, Area Parkir"
  },
  {
    id: 6,
    nama: "Pantai Lumpue",
    kategori: "Bahari & Pantai",
    kecamatan: "Bacukiki Barat",
    alamat: "Kel. Lumpue, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.045200,
    longitude: 119.624500,
    jam_buka: "06.00 - 18.00 WITA",
    tiket: "Rp 5.000 / orang",
    deskripsi: "Pantai tertua di Parepare dengan pasir putih kecokelatan yang landai, sangat digemari keluarga untuk berenang dan bermain pasir.",
    fasilitas: "Gazebo Sewa, Warung Tradisional, Kamar Bilas, Parkir"
  },
  {
    id: 7,
    nama: "Museum BJ Habibie (Rumah Masa Kecil)",
    kategori: "Sejarah & Edukasi",
    kecamatan: "Ujung",
    alamat: "Jl. Alwi Abdul Jalil Habibie, Mallusetasi, Kec. Ujung, Kota Parepare",
    latitude: -4.011200,
    longitude: 119.623500,
    jam_buka: "08.00 - 16.00 WITA",
    tiket: "Rp 10.000 / orang",
    deskripsi: "Museum resmi yang dibangun di atas rumah kelahiran dan masa kecil B.J. Habibie, memamerkan memorabilia, foto, dan penghargaan nasional/internasional.",
    fasilitas: "Ruang Galeri Ber-AC, Pemandu Wisata, Teater Mini, Toilet"
  },
  {
    id: 8,
    nama: "Ladoma (Ladang Terbuka & Kolam Alam)",
    kategori: "Alam & Ekowisata",
    kecamatan: "Bacukiki",
    alamat: "Kel. Watang Bacukiki, Kec. Bacukiki, Kota Parepare",
    latitude: -4.049800,
    longitude: 119.654200,
    jam_buka: "08.00 - 17.30 WITA",
    tiket: "Rp 10.000 / orang",
    deskripsi: "Destinasi agrowisata dan outbound dengan aliran sungai bebatuan alami, gazebo bambu tradisional, dan pemandangan lembah perbukitan Bacukiki.",
    fasilitas: "Flying Fox, Kolam Alami, Gazebo Lembah, Warung Makanan"
  },
  {
    id: 9,
    nama: "Taman Syariah Parepare",
    kategori: "Rekreasi & Budaya",
    kecamatan: "Soreang",
    alamat: "Jl. Bau Massepe, Cappa Galung, Kec. Soreang, Kota Parepare",
    latitude: -3.992100,
    longitude: 119.628800,
    jam_buka: "06.00 - 22.00 WITA",
    tiket: "Gratis",
    deskripsi: "Taman kota bernuansa arsitektur Islam dengan air mancur, kaligrafi ornamen, dan area rekreasi keluarga yang asri dan tertib.",
    fasilitas: "Area Bermain Anak, Bangku Taman, Air Mancur, Lampu Hias"
  },
  {
    id: 10,
    nama: "Anjungan Cempae",
    kategori: "Bahari & Pantai",
    kecamatan: "Soreang",
    alamat: "Kel. Wattang Soreang, Kec. Soreang, Kota Parepare",
    latitude: -3.985400,
    longitude: 119.629100,
    jam_buka: "24 Jam",
    tiket: "Gratis",
    deskripsi: "Ruang publik pesisir terbaru di kawasan Soreang dengan dermaga pejalan kaki menjorok ke laut, spot foto kekinian, dan pusat jajanan UMKM.",
    fasilitas: "Anjungan Laut, Sentra Kuliner UMKM, Spot Foto Sunset, Toilet"
  },
  {
    id: 11,
    nama: "Waterboom Parepare (Gedung Pemuda)",
    kategori: "Rekreasi & Keluarga",
    kecamatan: "Bacukiki",
    alamat: "Jl. Gelora Mandiri, Lompoe, Kec. Bacukiki, Kota Parepare",
    latitude: -4.019800,
    longitude: 119.661200,
    jam_buka: "09.00 - 17.00 WITA",
    tiket: "Rp 25.000 / orang",
    deskripsi: "Wahana rekreasi air keluarga terlengkap di Ajatappareng dengan berbagai seluncuran air, kolam arus, dan kolam tumpah anak.",
    fasilitas: "Water Slide, Kolam Arus, Loker, Kantin, Gazebo"
  },
  {
    id: 12,
    nama: "Salatiga Hills (Wisata Puncak)",
    kategori: "Alam & Ekowisata",
    kecamatan: "Bacukiki",
    alamat: "Lemba Baqa, Kel. Lemoe, Kec. Bacukiki, Kota Parepare",
    latitude: -4.061200,
    longitude: 119.673400,
    jam_buka: "07.00 - 19.00 WITA",
    tiket: "Rp 5.000 / orang",
    deskripsi: "Wisata alam perbukitan dengan pemandangan lanskap perbukitan hijau, spot foto awan kabut pagi hari, dan udara sejuk pegunungan.",
    fasilitas: "Gardu Pandang, Kafe Puncak, Spot Foto Bunga, Parkir Motor"
  }
];

// 2. DATA REAL AKOMODASI (HOTEL, WISMA, PENGINAPAN, GUEST HOUSE) KOTA PAREPARE (22 UNIT)
const rawHotel = [
  // --- HOTEL BINTANG ---
  {
    id: 1,
    nama: "Hotel Kenari Bukit Resort",
    tipe: "Hotel",
    kategori: "Hotel Bintang 3",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Jend. Sudirman No.65, Bumi Harapan, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.033374,
    longitude: 119.630495,
    kisaran_harga: "Rp 350.000 - Rp 650.000",
    telepon: "(0421) 21125",
    fasilitas: "Kolam Renang, Restoran, Ruang Rapat, WiFi, Parkir Luas"
  },
  {
    id: 2,
    nama: "Hotel Pare Wisata",
    tipe: "Hotel",
    kategori: "Hotel Bintang 2",
    kecamatan: "Ujung",
    alamat: "Jl. Sulawesi No.25, Mallusetasi, Kec. Ujung, Kota Parepare",
    latitude: -4.005960,
    longitude: 119.623017,
    kisaran_harga: "Rp 250.000 - Rp 450.000",
    telepon: "(0421) 21545",
    fasilitas: "Restoran, AC, TV Kabel, WiFi, Layanan Kamar 24 Jam"
  },
  {
    id: 3,
    nama: "Hotel Permata Sari",
    tipe: "Hotel",
    kategori: "Hotel Bintang 2",
    kecamatan: "Ujung",
    alamat: "Jl. Bau Massepe No.195, Labukkang, Kec. Ujung, Kota Parepare",
    latitude: -4.008157,
    longitude: 119.625227,
    kisaran_harga: "Rp 275.000 - Rp 500.000",
    telepon: "(0421) 22388",
    fasilitas: "Meeting Room, Kafe, Parkir Pribadi, WiFi Cepat"
  },
  {
    id: 4,
    nama: "Pare Beach Hotel",
    tipe: "Hotel",
    kategori: "Hotel Bintang 3",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Mattirotasi No.105, Kp. Baru, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.023226,
    longitude: 119.624160,
    kisaran_harga: "Rp 380.000 - Rp 750.000",
    telepon: "(0421) 24455",
    fasilitas: "Pemandangan Laut Langsung, Restoran Tepi Pantai, Rooftop Bar, WiFi"
  },
  {
    id: 5,
    nama: "Hotel Delima Sari",
    tipe: "Hotel",
    kategori: "Hotel Bintang 1",
    kecamatan: "Ujung",
    alamat: "Jl. Bau Massepe No.234, Cappa Galung, Kec. Ujung, Kota Parepare",
    latitude: -4.007778,
    longitude: 119.625958,
    kisaran_harga: "Rp 180.000 - Rp 300.000",
    telepon: "(0421) 21789",
    fasilitas: "AC, Sarapan, Parkir, Layanan Laundry"
  },
  {
    id: 6,
    nama: "Hotel Grand Star",
    tipe: "Hotel",
    kategori: "Hotel Bintang 3",
    kecamatan: "Ujung",
    alamat: "Jl. Bau Massepe No.88, Labukkang, Kec. Ujung, Kota Parepare",
    latitude: -4.007008,
    longitude: 119.625419,
    kisaran_harga: "Rp 320.000 - Rp 600.000",
    telepon: "(0421) 28999",
    fasilitas: "Ballroom, Restoran, Pusat Kebugaran, Lift, Parkir Basement"
  },
  {
    id: 7,
    nama: "Hotel Bugis",
    tipe: "Hotel",
    kategori: "Hotel Melati / Budget",
    kecamatan: "Ujung",
    alamat: "Jl. Sultan Hasanuddin No.12, Ujung Sabbang, Kec. Ujung, Kota Parepare",
    latitude: -4.007629,
    longitude: 119.624803,
    kisaran_harga: "Rp 150.000 - Rp 250.000",
    telepon: "(0421) 23111",
    fasilitas: "AC, TV, Musholla, Lokasi Strategis Dekat Pelabuhan"
  },
  {
    id: 8,
    nama: "Hotel Puri Gandaria",
    tipe: "Hotel",
    kategori: "Hotel Bintang 2",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Jend. Sudirman No.140, Lumpue, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.047897,
    longitude: 119.628086,
    kisaran_harga: "Rp 250.000 - Rp 450.000",
    telepon: "(0421) 27660",
    fasilitas: "Taman Asri, Restoran, Ruang Seminar, Parkir Aman"
  },
  {
    id: 9,
    nama: "Hotel Musa Pratama",
    tipe: "Hotel",
    kategori: "Hotel Melati / Budget",
    kecamatan: "Soreang",
    alamat: "Jl. Jend. Ahmad Yani Km.4, Lapadde, Kec. Soreang, Kota Parepare",
    latitude: -3.992333,
    longitude: 119.652733,
    kisaran_harga: "Rp 175.000 - Rp 300.000",
    telepon: "(0421) 26344",
    fasilitas: "AC, Parkir Kendaraan Luas, Dekat Akses Antarkota"
  },
  {
    id: 10,
    nama: "Hotel Mario & Cafe",
    tipe: "Hotel",
    kategori: "Hotel Bintang 1",
    kecamatan: "Ujung",
    alamat: "Jl. Lahalede No.45, Ujung Baru, Kec. Ujung, Kota Parepare",
    latitude: -4.014200,
    longitude: 119.626800,
    kisaran_harga: "Rp 200.000 - Rp 350.000",
    telepon: "(0421) 24123",
    fasilitas: "Kafe 24 Jam, Live Music, Free WiFi, Parkir Motor/Mobil"
  },

  // --- WISMA & GUEST HOUSE ---
  {
    id: 11,
    nama: "Wisma Transit Parepare",
    tipe: "Wisma",
    kategori: "Wisma / Penginapan",
    kecamatan: "Ujung",
    alamat: "Jl. Lasinrang No.5, Mallusetasi, Kec. Ujung, Kota Parepare",
    latitude: -4.014230,
    longitude: 119.621216,
    kisaran_harga: "Rp 120.000 - Rp 220.000",
    telepon: "(0421) 21900",
    fasilitas: "AC, Kamar Mandi Dalam, TV, Dekat Pelabuhan Nusantara"
  },
  {
    id: 12,
    nama: "Wisma Thoyyibah Abadi",
    tipe: "Wisma",
    kategori: "Wisma / Guest House",
    kecamatan: "Ujung",
    alamat: "Jl. Veteran No.28, Mallusetasi, Kec. Ujung, Kota Parepare",
    latitude: -4.005728,
    longitude: 119.631328,
    kisaran_harga: "Rp 130.000 - Rp 250.000",
    telepon: "(0421) 22877",
    fasilitas: "Aula Serbaguna, Musholla, WiFi, Suasana Tenang & Bersih"
  },
  {
    id: 13,
    nama: "Wisma Melati Indah",
    tipe: "Wisma",
    kategori: "Wisma / Penginapan",
    kecamatan: "Ujung",
    alamat: "Jl. Bau Massepe No.120, Labukkang, Kec. Ujung, Kota Parepare",
    latitude: -4.010500,
    longitude: 119.624100,
    kisaran_harga: "Rp 125.000 - Rp 230.000",
    telepon: "(0421) 25670",
    fasilitas: "AC, Ruang Tamu, Air Mineral Gratis, Parkir Motor"
  },
  {
    id: 14,
    nama: "Wisma Mutiara Sudirman",
    tipe: "Wisma",
    kategori: "Wisma / Penginapan",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Jend. Sudirman No.38, Bumi Harapan, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.028900,
    longitude: 119.627500,
    kisaran_harga: "Rp 140.000 - Rp 260.000",
    telepon: "(0421) 23890",
    fasilitas: "AC, TV LED, WiFi, Laundry, Resepsionis 24 Jam"
  },
  {
    id: 15,
    nama: "Wisma Mario Indah Mattirotasi",
    tipe: "Wisma",
    kategori: "Wisma / Guest House",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Mattirotasi No.42, Kp. Baru, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.020100,
    longitude: 119.623100,
    kisaran_harga: "Rp 160.000 - Rp 280.000",
    telepon: "(0421) 24780",
    fasilitas: "Balkon Menghadap Pantai, AC, WiFi, Teh/Kopi Pagi"
  },
  {
    id: 16,
    nama: "Wisma Kenari Indah",
    tipe: "Wisma",
    kategori: "Wisma / Penginapan",
    kecamatan: "Bacukiki Barat",
    alamat: "Jl. Jend. Sudirman No.80, Tiro Sompe, Kec. Bacukiki Barat, Kota Parepare",
    latitude: -4.038100,
    longitude: 119.629200,
    kisaran_harga: "Rp 135.000 - Rp 240.000",
    telepon: "(0421) 27120",
    fasilitas: "Parkir Mobil Luas, AC, Dapur Bersama, Area Hijau"
  },
  {
    id: 17,
    nama: "Wisma Bintang Soreang",
    tipe: "Wisma",
    kategori: "Wisma / Penginapan",
    kecamatan: "Soreang",
    alamat: "Jl. Bau Massepe No.310, Cappa Galung, Kec. Soreang, Kota Parepare",
    latitude: -3.989500,
    longitude: 119.628200,
    kisaran_harga: "Rp 130.000 - Rp 220.000",
    telepon: "(0421) 28340",
    fasilitas: "AC, Air Panas, WiFi, Dekat Akses Terminal Induk Soreang"
  },

  // --- TEMPAT PENGINAPAN & HOMESTAY ---
  {
    id: 18,
    nama: "Penginapan Sejahtera Pelabuhan",
    tipe: "Penginapan",
    kategori: "Penginapan Sederhana",
    kecamatan: "Ujung",
    alamat: "Jl. Pelabuhan Nusantara No.8, Mallusetasi, Kec. Ujung, Kota Parepare",
    latitude: -4.013200,
    longitude: 119.622500,
    kisaran_harga: "Rp 100.000 - Rp 180.000",
    telepon: "(0421) 29011",
    fasilitas: "Kipas/AC, Lemari, Musholla, 2 Menit ke Dermaga Kapal Pelni"
  },
  {
    id: 19,
    nama: "Penginapan Surya Mandiri (Guest House)",
    tipe: "Penginapan",
    kategori: "Guest House / Kost Eksklusif",
    kecamatan: "Ujung",
    alamat: "Jl. Lahalede No.15, Ujung Baru, Kec. Ujung, Kota Parepare",
    latitude: -4.013953,
    longitude: 119.626706,
    kisaran_harga: "Rp 150.000 - Rp 250.000",
    telepon: "(0421) 26188",
    fasilitas: "Kamar Modern Minimalis, WiFi 50 Mbps, Pantry, Parkir Berpagar"
  },
  {
    id: 20,
    nama: "Penginapan Pondok Asri Soreang",
    tipe: "Penginapan",
    kategori: "Penginapan / Homestay",
    kecamatan: "Soreang",
    alamat: "Jl. Jend. Ahmad Yani Km.3, Lapadde, Kec. Soreang, Kota Parepare",
    latitude: -3.998200,
    longitude: 119.645300,
    kisaran_harga: "Rp 130.000 - Rp 220.000",
    telepon: "(0421) 27950",
    fasilitas: "Taman Bunga Asri, Dapur Bersama, Dekat Kebun Raya Jompie"
  },
  {
    id: 21,
    nama: "Homestay Syariah Bacukiki",
    tipe: "Penginapan",
    kategori: "Homestay / Penginapan",
    kecamatan: "Bacukiki",
    alamat: "Jl. Jend. Sudirman Poros Sidrap, Lemoe, Kec. Bacukiki, Kota Parepare",
    latitude: -4.041500,
    longitude: 119.652100,
    kisaran_harga: "Rp 120.000 - Rp 200.000",
    telepon: "(0421) 28840",
    fasilitas: "Konsep Keluarga Syariah, Garasi, Teras Santai, Udara Sejuk"
  },
  {
    id: 22,
    nama: "Penginapan Lembah Hijau Bacukiki",
    tipe: "Penginapan",
    kategori: "Penginapan / Pondok Wisata",
    kecamatan: "Bacukiki",
    alamat: "Jl. Gelora Mandiri, Lompoe, Kec. Bacukiki, Kota Parepare",
    latitude: -4.025500,
    longitude: 119.658200,
    kisaran_harga: "Rp 140.000 - Rp 250.000",
    telepon: "(0421) 29400",
    fasilitas: "Dekat Kawasan Rekreasi Air Waterboom & Agrowisata, Gazebo"
  }
];

// 3. ANALISIS SPASIAL: BUFFER 2 KM & KETERJANGKAUAN WISATA
console.log(`Memulai analisis spasial jangkauan 2 km dari ${rawHotel.length} fasilitas akomodasi...`);

// Konversi akomodasi menjadi GeoJSON FeatureCollection
const hotelFeatures = rawHotel.map(h => {
  return turf.point([h.longitude, h.latitude], { ...h });
});
const hotelFC = turf.featureCollection(hotelFeatures);

// Buat individual buffer 2 km untuk tiap akomodasi
const individualBuffers = hotelFeatures.map(h => {
  const buf = turf.buffer(h, 2, { units: 'kilometers' });
  buf.properties = {
    id_hotel: h.properties.id,
    nama_hotel: h.properties.nama,
    tipe: h.properties.tipe,
    radius_km: 2
  };
  return buf;
});

// Union buffer (area jangkauan total)
let mergedBuffer = individualBuffers[0];
for (let i = 1; i < individualBuffers.length; i++) {
  try {
    mergedBuffer = turf.union(turf.featureCollection([mergedBuffer, individualBuffers[i]]));
  } catch (e) {
    // Abaikan jika overlap
  }
}
mergedBuffer.properties = {
  nama: "Kawasan Jangkauan Akomodasi (Radius 2 Km)",
  total_akomodasi: rawHotel.length,
  radius_km: 2,
  metode: "Geodesic Buffer (Turf.js)"
};

// Hitung keterjangkauan untuk tiap objek wisata
const wisataWithAnalysis = rawWisata.map(w => {
  const pt = turf.point([w.longitude, w.latitude]);
  
  let nearestHotel = null;
  let nearestType = null;
  let minDistanceM = Infinity;

  hotelFeatures.forEach(hf => {
    const distM = turf.distance(pt, hf, { units: 'kilometers' }) * 1000;
    if (distM < minDistanceM) {
      minDistanceM = Math.round(distM);
      nearestHotel = hf.properties.nama;
      nearestType = hf.properties.tipe;
    }
  });

  const isCovered = minDistanceM <= 2000;

  return {
    ...w,
    terjangkau_hotel_2km: isCovered,
    status_akses: isCovered ? "Terjangkau (≤ 2 km)" : "Belum Terjangkau (> 2 km)",
    hotel_terdekat: nearestHotel,
    tipe_akomodasi_terdekat: nearestType,
    jarak_ke_hotel_m: minDistanceM,
    jarak_ke_hotel_km: (minDistanceM / 1000).toFixed(2)
  };
});

const wisataFeatures = wisataWithAnalysis.map(w => {
  return turf.point([w.longitude, w.latitude], { ...w });
});
const wisataFC = turf.featureCollection(wisataFeatures);

// 4. STATISTIK PER KECAMATAN
const kecList = ['Bacukiki', 'Bacukiki Barat', 'Ujung', 'Soreang'];
const rekapKecamatan = kecList.map(kec => {
  const wKec = wisataWithAnalysis.filter(w => w.kecamatan === kec);
  const hKec = rawHotel.filter(h => h.kecamatan === kec);
  const covered = wKec.filter(w => w.terjangkau_hotel_2km);

  return {
    kecamatan: kec,
    jumlah_wisata: wKec.length,
    wisata_terjangkau: covered.length,
    wisata_belum_terjangkau: wKec.length - covered.length,
    persen_terjangkau: wKec.length > 0 ? Math.round((covered.length / wKec.length) * 100) : 0,
    total_akomodasi: hKec.length,
    hotel_bintang: hKec.filter(h => h.tipe === 'Hotel').length,
    wisma: hKec.filter(h => h.tipe === 'Wisma').length,
    penginapan: hKec.filter(h => h.tipe === 'Penginapan').length,
    daftar_wisata: wKec.map(w => w.nama),
    daftar_akomodasi: hKec.map(h => `${h.nama} (${h.tipe})`)
  };
});

const totalWisata = wisataWithAnalysis.length;
const totalTerjangkau = wisataWithAnalysis.filter(w => w.terjangkau_hotel_2km).length;
const totalBelumTerjangkau = totalWisata - totalTerjangkau;
const persenTotalTerjangkau = Math.round((totalTerjangkau / totalWisata) * 100);

const summary = {
  judul: "Analisis Spasial Aksesibilitas Destinasi Wisata terhadap Fasilitas Akomodasi (Radius 2 Km) Kota Parepare",
  tanggal_analisis: new Date().toISOString(),
  parameter: {
    radius_buffer_km: 2,
    metode_jarak: "Geodesic Haversine / Turf.js",
    crs: "EPSG:4326 (WGS84)"
  },
  hasil_keseluruhan: {
    total_destinasi_wisata: totalWisata,
    total_akomodasi: rawHotel.length,
    total_hotel_bintang: rawHotel.filter(h => h.tipe === 'Hotel').length,
    total_wisma: rawHotel.filter(h => h.tipe === 'Wisma').length,
    total_penginapan: rawHotel.filter(h => h.tipe === 'Penginapan').length,
    wisata_terjangkau_radius_2km: totalTerjangkau,
    wisata_belum_terjangkau_radius_2km: totalBelumTerjangkau,
    persentase_aksesibilitas: persenTotalTerjangkau
  },
  rekap_per_kecamatan: rekapKecamatan
};

// 5. SIMPAN KE FILE GEOJSON & JS (DUAL LOADING)
const bufferFC = turf.featureCollection([mergedBuffer, ...individualBuffers]);

fs.writeFileSync('./data/wisata_parepare.geojson', JSON.stringify(wisataFC, null, 2), 'utf8');
fs.writeFileSync('./data/wisata_parepare.js', `const dataWisata = ${JSON.stringify(wisataFC, null, 2)};`, 'utf8');

fs.writeFileSync('./data/hotel_parepare.geojson', JSON.stringify(hotelFC, null, 2), 'utf8');
fs.writeFileSync('./data/hotel_parepare.js', `const dataHotel = ${JSON.stringify(hotelFC, null, 2)};`, 'utf8');

fs.writeFileSync('./data/buffer_hotel_2km.geojson', JSON.stringify(bufferFC, null, 2), 'utf8');
fs.writeFileSync('./data/buffer_hotel_2km.js', `const dataBufferHotel = ${JSON.stringify(bufferFC, null, 2)};`, 'utf8');

fs.writeFileSync('./data/analisis_summary.json', JSON.stringify(summary, null, 2), 'utf8');
fs.writeFileSync('./data/analisis_summary.js', `const dataSummary = ${JSON.stringify(summary, null, 2)};`, 'utf8');

// Tulis juga daftar sumber data untuk kelengkapan pengumpulan
const sumberDataText = `DAFTAR SUMBER DATA SPASIAL
TUGAS PRAKTIKUM P08 - WEBGIS KOTA PAREPARE
Mahasiswa: M. ARIEF ABDILLAH (V126241003)
Dosen: Andang Suryana Soma, S.Hut., M.P., Ph.D.

1. Batas Administrasi Kecamatan Kota Parepare:
   - Sumber: Ina-Geoportal Badan Informasi Geospasial (BIG)
   - Layer: ADMINISTRASIKECAMATAN_AR_50K (Skala 1:50.000)
   - Datum: WGS84 (EPSG:4326)
   - Format: Shapefile (.shp, .dbf, .prj, .shx) -> Dikonversi ke GeoJSON

2. Data Demografi & Kewilayahan:
   - Sumber: Badan Pusat Statistik (BPS) Kota Parepare
   - Publikasi: "Kota Parepare Dalam Angka 2024"
   - Atribut: Luas wilayah (km²), Jumlah Penduduk (jiwa), Kepadatan, Jumlah Kelurahan

3. Titik Objek Wisata (12 Destinasi):
   - Sumber: OpenStreetMap (OSM) Contributors & Disporapar Kota Parepare (2024/2025)
   - Lisensi: Open Database License (ODbL)

4. Titik Akomodasi (22 Unit: Hotel, Wisma, Penginapan, Guest House):
   - Sumber: OpenStreetMap (OSM) Contributors, PHRI Parepare, dan Direktori Penginapan Kota Parepare (2024/2025)
   - Klasifikasi:
     * 10 Hotel (Bintang 1, 2, 3 & Melati)
     * 7 Wisma & Guest House
     * 5 Penginapan & Homestay
   - Lisensi: Open Database License (ODbL)

5. Analisis Spasial Jangkauan Layanan:
   - Metode: Geodesic Buffer Jangkauan Layanan 2 Km (Turf.js)
   - Klasifikasi: Terjangkau (<= 2 km) vs Belum Terjangkau (> 2 km)
`;

fs.writeFileSync('./data/daftar_sumber_data.txt', sumberDataText, 'utf8');

console.log("=== SELESAI ANALISIS DATASET TERBARU ===");
console.log(`Total Wisata: ${totalWisata}`);
console.log(`Total Akomodasi: ${rawHotel.length} (Hotel: 10, Wisma: 7, Penginapan: 5)`);
console.log(`Wisata Terjangkau Akomodasi (<= 2 km): ${totalTerjangkau} (${persenTotalTerjangkau}%)`);
console.log(`Wisata Belum Terjangkau (> 2 km): ${totalBelumTerjangkau}`);
console.log("\nRekapitulasi per Kecamatan:");
rekapKecamatan.forEach(r => {
  console.log(`- ${r.kecamatan}: ${r.jumlah_wisata} wisata (${r.wisata_terjangkau} terjangkau, ${r.persen_terjangkau}%), ${r.total_akomodasi} akomodasi (${r.hotel_bintang} hotel, ${r.wisma} wisma, ${r.penginapan} penginapan)`);
});
