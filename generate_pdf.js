const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function generatePDF() {
  console.log('Starting PDF generation...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const url = 'http://localhost:3000/dokumen/lembar_tugas_p08.html';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for all images to fully load
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll('img'));
    await Promise.all(selectors.map(img => {
      if (img.complete) return;
      return new Promise((resolve, reject) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      });
    }));
  });

  const outputPdfPath = path.join(__dirname, 'dokumen', 'V126241003_M_Arief_Abdillah_P08_LembarTugas.pdf');

  console.log('Generating PDF...');
  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm'
    }
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${outputPdfPath}`);
  
  const stats = fs.statSync(outputPdfPath);
  console.log(`PDF File size: ${(stats.size / 1024).toFixed(2)} KB`);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
