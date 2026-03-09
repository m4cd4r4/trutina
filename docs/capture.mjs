import { chromium } from 'playwright';

const BASE = 'https://trutina.com.au';

const pages = [
  { name: '01-landing-hero',      url: '/',                     fullPage: false },
  { name: '02-landing-features',  url: '/#features',            fullPage: false, scroll: '#features' },
  { name: '03-landing-pricing',   url: '/#pricing',             fullPage: false, scroll: '#pricing' },
  { name: '04-demo-list',         url: '/demo',                 fullPage: true },
  { name: '05-case-clean',        url: '/demo/demo-clean',      fullPage: true },
  { name: '06-case-ai-fake',      url: '/demo/demo-ai-fake',    fullPage: true },
  { name: '07-case-bad-abn',      url: '/demo/demo-bad-abn',    fullPage: true },
  { name: '08-case-bank-fraud',   url: '/demo/demo-bank-fraud', fullPage: true },
  { name: '09-case-broker',       url: '/demo/demo-broker-cluster', fullPage: true },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const p of pages) {
    const page = await context.newPage();
    await page.goto(`${BASE}${p.url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    if (p.scroll) {
      await page.evaluate((sel) => {
        document.querySelector(sel)?.scrollIntoView({ behavior: 'instant' });
      }, p.scroll);
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: `docs/screenshots/${p.name}.png`,
      fullPage: p.fullPage,
    });
    console.log(`✓ ${p.name}`);
    await page.close();
  }

  // Mobile landing
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: 'docs/screenshots/10-landing-mobile.png',
    fullPage: true,
  });
  console.log('✓ 10-landing-mobile');
  await mobilePage.close();

  await browser.close();
  console.log('\nDone — all screenshots saved to docs/screenshots/');
})();
