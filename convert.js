const fs = require('fs');
const shapefile = require('shapefile');

const shpPath = './data/raw/ADMINISTRASIKECAMATAN_AR_50K.shp';
const dbfPath = './data/raw/ADMINISTRASIKECAMATAN_AR_50K.dbf';

// Data resmi BPS Kota Parepare (Kota Parepare Dalam Angka 2024)
const bpsData = {
  'Bacukiki': { luas_km2: 66.70, penduduk: 27150, kelurahan: 4, kode_bps: '7372010' },
  'Bacukiki Barat': { luas_km2: 10.42, penduduk: 45680, kelurahan: 6, kode_bps: '7372011' },
  'Ujung': { luas_km2: 5.09, penduduk: 36240, kelurahan: 5, kode_bps: '7372020' },
  'Soreang': { luas_km2: 9.18, penduduk: 46830, kelurahan: 7, kode_bps: '7372030' }
};

async function processData() {
  try {
    const raw = await shapefile.read(shpPath, dbfPath);
    
    // Filter hanya kecamatan di Kota Parepare
    const parepareFeatures = raw.features.filter(f => {
      const kab = (f.properties.WADMKK || '').toLowerCase();
      const kec = f.properties.NAMOBJ;
      return kab.includes('pare') || ['Bacukiki', 'Bacukiki Barat', 'Ujung', 'Soreang'].includes(kec);
    }).map(f => {
      const kecName = f.properties.NAMOBJ;
      const stat = bpsData[kecName] || { luas_km2: 0, penduduk: 0, kelurahan: 0, kode_bps: '-' };
      
      return {
        type: 'Feature',
        properties: {
          kecamatan: kecName,
          kota: 'Kota Parepare',
          provinsi: 'Sulawesi Selatan',
          luas_km2: stat.luas_km2,
          penduduk_jiwa: stat.penduduk,
          kepadatan_jiwa_km2: stat.luas_km2 > 0 ? Math.round(stat.penduduk / stat.luas_km2) : 0,
          jumlah_kelurahan: stat.kelurahan,
          kode_bps: stat.kode_bps,
          sumber_data: 'Ina-Geoportal BIG & BPS Kota Parepare (2024)'
        },
        geometry: f.geometry
      };
    });

    const geojson = {
      type: 'FeatureCollection',
      name: 'Batas_Kecamatan_Kota_Parepare',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: parepareFeatures
    };

    fs.writeFileSync('./data/kecamatan_parepare.geojson', JSON.stringify(geojson, null, 2), 'utf8');
    fs.writeFileSync('./data/kecamatan_parepare.js', `const dataKecamatan = ${JSON.stringify(geojson, null, 2)};`, 'utf8');

    console.log(`Berhasil memproses ${geojson.features.length} kecamatan Kota Parepare:`);
    geojson.features.forEach(f => {
      console.log(`- ${f.properties.kecamatan}: ${f.properties.luas_km2} km², ${f.properties.penduduk_jiwa} jiwa`);
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

processData();
