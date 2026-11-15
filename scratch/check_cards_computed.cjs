const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/#work', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const cards = await page.$$eval('.work__card', els => els.map(el => {
    const cs = window.getComputedStyle(el);
    return {
      background: cs.background,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage,
      border: cs.border,
      boxShadow: cs.boxShadow
    };
  }));

  console.log('Cards computed styles:', JSON.stringify(cards, null, 2));
  await browser.close();
})();

