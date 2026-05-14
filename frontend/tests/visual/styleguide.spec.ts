import { test, expect } from '@playwright/test'

// Six styleguide routes diffed against committed baselines under
//   tests/visual/styleguide.spec.ts-snapshots/
// Baselines were regenerated 2026-05-15 against post-pivot UI.
// Refresh with: npm run test:visual:update

const PAGES = [
  { route: '/styleguide/queue',       baseline: '01-queue.png',       waitFor: '.q-table tbody tr' },
  { route: '/styleguide/case-detail', baseline: '02-case-detail.png', waitFor: '.module-card.is-active' },
  { route: '/styleguide/broker',      baseline: '03-broker.png',      waitFor: '.q-table tbody tr' },
  { route: '/styleguide/audit',       baseline: '04-audit.png',       waitFor: '.print-page' },
  { route: '/styleguide/demo',        baseline: '05-demo.png',        waitFor: '.q-table tbody tr' },
  { route: '/styleguide/marketing',   baseline: '06-marketing.png',   waitFor: '.hero h1' },
] as const

for (const p of PAGES) {
  test(`${p.baseline}: ${p.route} matches baseline within tolerance`, async ({ page }) => {
    await page.goto(p.route, { waitUntil: 'networkidle' })
    await page.waitForSelector(p.waitFor, { timeout: 15_000 })
    // Wait for web fonts to settle before snapshotting.
    await page.evaluate(() => (document as Document & { fonts?: { ready: Promise<void> } }).fonts?.ready)
    await expect(page).toHaveScreenshot(p.baseline, { fullPage: true })
  })
}
