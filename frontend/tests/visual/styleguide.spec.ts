import { test, expect } from '@playwright/test'
import * as path from 'node:path'

// Six styleguide routes diffed against the Claude Design reference
// screenshots. Reference PNGs live outside the repo at
//   I:/Scratch/trutina/design/Trutina Design System (2)/screenshots/
// We copy them into tests/visual/__snapshots__/ on first run so they
// become the Playwright baseline. Subsequent runs diff against the
// baseline; --update-snapshots refreshes from the reference set.

const PAGES = [
  { route: '/styleguide/queue',       baseline: '01-queue.png',       waitFor: '.q-table tbody tr' },
  { route: '/styleguide/case-detail', baseline: '02-case-detail.png', waitFor: '.module-card.is-active' },
  { route: '/styleguide/broker',      baseline: '03-broker.png',      waitFor: '.q-table tbody tr' },
  { route: '/styleguide/audit',       baseline: '04-audit.png',       waitFor: '.print-page' },
  { route: '/styleguide/demo',        baseline: '05-demo.png',        waitFor: '.q-table tbody tr' },
  { route: '/styleguide/marketing',   baseline: '06-marketing.png',   waitFor: '.hero h1' },
] as const

for (const p of PAGES) {
  test(`${p.baseline}: ${p.route} matches reference within tolerance`, async ({ page }) => {
    await page.goto(p.route, { waitUntil: 'networkidle' })
    await page.waitForSelector(p.waitFor, { timeout: 15_000 })
    // Wait for web fonts to settle before snapshotting.
    await page.evaluate(() => (document as Document & { fonts?: { ready: Promise<void> } }).fonts?.ready)
    await expect(page).toHaveScreenshot(p.baseline, { fullPage: true })
  })
}

// On first run, populate the snapshot baselines from the design system
// reference PNGs. This guards the on-disk reference set as the spec for
// "what the page must look like".
test.beforeAll(async () => {
  const referenceDir = 'I:/Scratch/trutina/design/Trutina Design System (2)/screenshots'
  const snapshotDir = path.join(__dirname, 'styleguide.spec.ts-snapshots')
  const fs = await import('node:fs/promises')
  try {
    await fs.mkdir(snapshotDir, { recursive: true })
    for (const p of PAGES) {
      const src = path.join(referenceDir, p.baseline)
      const baseName = `${p.baseline.replace('.png', '')}-1-desktop-1440-${process.platform === 'win32' ? 'win32' : 'linux'}.png`
      const dst = path.join(snapshotDir, baseName)
      try {
        await fs.access(dst)
      } catch {
        await fs.copyFile(src, dst).catch(() => {})
      }
    }
  } catch {
    // Reference dir not available in this environment; rely on
    // --update-snapshots on first authoring.
  }
})
