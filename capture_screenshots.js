const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const screenshotsDir = path.join(__dirname, 'dokumen', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // wait for tiles and animations

  // 1. Overview Map
  console.log('Taking screenshot 1: Overview...');
  await page.screenshot({ path: path.join(screenshotsDir, '01_webgis_overview.png') });

  // 2. Click a tourism point to show interactive buffer and popup
  console.log('Taking screenshot 2: Buffer and popup...');
  await page.evaluate(() => {
    // find a marker or trigger popup for a known point, e.g. Pantai Lumpue or Mattirotasi
    if (window.wisataLayer) {
      window.wisataLayer.eachLayer(layer => {
        if (layer.feature && layer.feature.properties && layer.feature.properties.nama.includes('Mattirotasi')) {
          layer.fire('click');
        }
      });
    }
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(screenshotsDir, '02_buffer_popup_detail.png') });

  // 3. Open Chart Dashboard / Filter
  console.log('Taking screenshot 3: Dashboard...');
  await page.evaluate(() => {
    const btn = document.querySelector('.btn-chart-toggle') || document.querySelector('#btnToggleCharts');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '03_chart_dashboard.png') });

  // 4. Attribute Table
  console.log('Navigating to Tabel Atribut...');
  await page.goto('http://localhost:3000/tabel_atribut.html', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, '04_tabel_atribut.png') });

  // 5. Mobile view
  console.log('Taking screenshot 5: Mobile Responsive...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(screenshotsDir, '05_mobile_view.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
