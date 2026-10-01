import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars'],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2, // Crisp 2x retina
    },
  });

  const page = await browser.newPage();

  // 1. Capture Login Page
  console.log('Capturing login page...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'login.png'), fullPage: false });

  // 2. Perform Login
  console.log('Logging in with testuser@gmail.com...');
  await page.type('input[type="email"]', 'testuser@gmail.com');
  await page.type('input[type="password"]', 'TestUser@123');
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
  ]);

  // Wait extra 2 seconds for all data to load
  await new Promise((r) => setTimeout(r, 2500));

  // 3. Capture Dashboard
  console.log('Capturing dashboard...');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard.png') });

  // 4. Capture Leads Table
  console.log('Capturing leads table...');
  await page.goto(`${BASE_URL}/admin/leads`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'leads.png') });

  // 5. Capture Lead Details (click first lead or navigate)
  console.log('Capturing lead details...');
  const firstRow = await page.$('table tbody tr');
  if (firstRow) {
    await firstRow.click();
    await new Promise((r) => setTimeout(r, 2500));
  } else {
    await page.goto(`${BASE_URL}/admin/leads/1`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 2000));
  }
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'lead-details.png') });

  // 6. Capture Calendar
  console.log('Capturing calendar...');
  await page.goto(`${BASE_URL}/admin/calendar`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'calendar.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
