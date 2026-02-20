const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = '/home/user/md-dex/screenshots';

const pages = [
  { name: '01-swap', path: '/swap', title: 'Swap' },
  { name: '02-liquidity', path: '/liquidity', title: 'Liquidity' },
  { name: '03-pool', path: '/pool', title: 'Pool' },
  { name: '04-portfolio', path: '/portfolio', title: 'Portfolio' },
  { name: '05-history', path: '/history', title: 'History' },
  { name: '06-farms', path: '/farms', title: 'Farms' },
  { name: '07-my-farms', path: '/farms/me', title: 'My Farms' },
  { name: '08-orders', path: '/orders', title: 'Orders' },
  { name: '09-trading', path: '/trading', title: 'Trading' },
];

async function takeScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  for (const pageInfo of pages) {
    console.log(`Taking screenshot of ${pageInfo.title} (${pageInfo.path})...`);
    const page = await context.newPage();

    try {
      await page.goto(`${BASE_URL}${pageInfo.path}`, {
        waitUntil: 'networkidle',
        timeout: 15000
      });

      // Wait a bit for any animations to complete
      await page.waitForTimeout(2000);

      const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Saved: ${screenshotPath}`);
    } catch (err) {
      console.error(`  Error on ${pageInfo.path}: ${err.message}`);
      // Try to take screenshot anyway
      try {
        const screenshotPath = path.join(SCREENSHOTS_DIR, `${pageInfo.name}-error.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  Saved error state: ${screenshotPath}`);
      } catch (e) {}
    }

    await page.close();
  }

  // Also take a screenshot of the root/home page
  console.log('Taking screenshot of root page...');
  const page = await context.newPage();
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-home.png'), fullPage: true });
    console.log('  Saved home page');
  } catch (err) {
    console.error(`  Error on root: ${err.message}`);
    try {
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '00-home-error.png'), fullPage: true });
    } catch (e) {}
  }
  await page.close();

  await browser.close();
  console.log('\nAll screenshots taken!');
  console.log('Screenshots saved to:', SCREENSHOTS_DIR);
}

takeScreenshots().catch(console.error);
