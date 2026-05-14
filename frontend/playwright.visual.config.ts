import { defineConfig, devices } from '@playwright/test'

// Visual-regression config separate from the e2e config. Boots `next dev`
// against the styleguide routes, captures screenshots at the design
// system canvas size (1440x900 app, 1280 marketing), and diffs against
// the reference PNGs in design/Trutina Design System (2)/screenshots/.
//
// Run with: npx playwright test -c playwright.visual.config.ts
//   first-run snapshot:   npx playwright test -c playwright.visual.config.ts --update-snapshots

const BASE_URL = process.env.VISUAL_BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,        // visual tests share a dev server; serialise.
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-visual-report' }]],
  timeout: 60_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,  // ~5% tolerance per brief.
      threshold: 0.2,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  webServer: process.env.VISUAL_BASE_URL ? undefined : {
    command: 'npm run dev',
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
})
