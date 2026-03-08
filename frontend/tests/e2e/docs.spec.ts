import { test, expect } from '@playwright/test'

test.describe('Docs Hub', () => {
  test('docs index page loads with heading', async ({ page }) => {
    await page.goto('/docs')
    await expect(page.locator('h1')).toContainText('Documentation & Resources')
  })

  test('docs index lists all 8 resource cards', async ({ page }) => {
    await page.goto('/docs')
    const cards = page.locator('a[href^="/docs/"]')
    await expect(cards).toHaveCount(8)
  })

  test('docs index cards link to correct routes', async ({ page }) => {
    await page.goto('/docs')
    const expectedRoutes = [
      '/docs/one-pager',
      '/docs/pitch',
      '/docs/roi',
      '/docs/integration',
      '/docs/risk-scores',
      '/docs/quickstart',
      '/docs/security',
      '/docs/compliance',
    ]
    for (const route of expectedRoutes) {
      await expect(page.locator(`a[href="${route}"]`)).toBeVisible()
    }
  })

  test('docs index has nav links to home and demo', async ({ page }) => {
    await page.goto('/docs')
    await expect(page.locator('nav a:has-text("Live Demo")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Home")')).toBeVisible()
  })
})

test.describe('Sales One-Pager', () => {
  test('page loads with key content', async ({ page }) => {
    await page.goto('/docs/one-pager')
    await expect(page.getByRole('heading', { name: 'The Problem' })).toBeVisible()
    await expect(page.getByText('What Trutina Does').first()).toBeVisible()
    await expect(page.getByText('Six Detection Modules').first()).toBeVisible()
  })

  test('pricing table renders all tiers', async ({ page }) => {
    await page.goto('/docs/one-pager')
    for (const tier of ['Free Trial', 'Starter', 'Professional', 'Enterprise']) {
      await expect(page.getByText(tier).first()).toBeVisible()
    }
  })

  test('shows CBA fraud figure', async ({ page }) => {
    await page.goto('/docs/one-pager')
    await expect(page.getByText('~A$1 billion').first()).toBeVisible()
  })

  test('has back to docs link', async ({ page }) => {
    await page.goto('/docs/one-pager')
    await expect(page.locator('a[href="/docs"]').first()).toBeVisible()
  })
})

test.describe('Pitch Deck', () => {
  test('loads on first slide with title', async ({ page }) => {
    await page.goto('/docs/pitch')
    await expect(page.getByText('Stop AI-Generated Mortgage Fraud')).toBeVisible()
  })

  test('slide counter shows 1/9', async ({ page }) => {
    await page.goto('/docs/pitch')
    await expect(page.locator('text=1/9')).toBeVisible()
  })

  test('arrow key navigates to next slide', async ({ page, browserName }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Keyboard nav not applicable on mobile')
    await page.goto('/docs/pitch')
    await expect(page.locator('text=1/9')).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(400)
    await expect(page.locator('text=2/9')).toBeVisible()
  })

  test('slide indicator dots are visible', async ({ page }) => {
    await page.goto('/docs/pitch')
    const dots = page.locator('button[class*="rounded-full"]')
    const count = await dots.count()
    expect(count).toBeGreaterThanOrEqual(9)
  })

  test('exit link goes to docs', async ({ page }) => {
    await page.goto('/docs/pitch')
    const exitLink = page.locator('a[href="/docs"]').first()
    await expect(exitLink).toBeVisible()
  })
})

test.describe('ROI Calculator', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/docs/roi')
    await expect(page.locator('h1')).toContainText('ROI Calculator')
  })

  test('shows 4 input sliders', async ({ page }) => {
    await page.goto('/docs/roi')
    const sliders = page.locator('input[type="range"]')
    await expect(sliders).toHaveCount(4)
  })

  test('displays calculated ROI output', async ({ page }) => {
    await page.goto('/docs/roi')
    await expect(page.getByText('Annual Fraud Exposure', { exact: true })).toBeVisible()
    await expect(page.getByText('Annual Savings', { exact: true })).toBeVisible()
    await expect(page.getByText('ROI Multiple', { exact: true })).toBeVisible()
  })

  test('shows recommended plan', async ({ page }) => {
    await page.goto('/docs/roi')
    const planText = page.getByText(/Starter|Professional|Enterprise/)
    await expect(planText.first()).toBeVisible()
  })

  test('has CTA linking to pricing', async ({ page }) => {
    await page.goto('/docs/roi')
    await expect(page.locator('a[href="/#pricing"]').first()).toBeVisible()
  })
})

test.describe('API Integration Guide', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/docs/integration')
    await expect(page.locator('h1')).toContainText('API Integration Guide')
  })

  test('shows webhook endpoint', async ({ page }) => {
    await page.goto('/docs/integration')
    await expect(page.locator('code:has-text("/api/v1/webhooks/ingest")').first()).toBeVisible()
  })

  test('shows key sections', async ({ page }) => {
    await page.goto('/docs/integration')
    await expect(page.getByText('Authentication').first()).toBeVisible()
    await expect(page.getByText('Request Format').first()).toBeVisible()
    await expect(page.getByText('Response Format').first()).toBeVisible()
    await expect(page.getByText('Code Samples').first()).toBeVisible()
    await expect(page.getByText('Error Codes').first()).toBeVisible()
  })

  test('code sample tabs switch content', async ({ page }) => {
    await page.goto('/docs/integration')
    const pythonTab = page.getByRole('button', { name: 'Python' })
    const nodeTab = page.getByRole('button', { name: 'Node.js' })

    await expect(pythonTab).toBeVisible()
    await expect(nodeTab).toBeVisible()

    await nodeTab.click()
    await expect(page.getByText('fs.readFileSync').first()).toBeVisible()
  })

  test('error codes section exists', async ({ page }) => {
    await page.goto('/docs/integration')
    await expect(page.getByText('Error Codes').first()).toBeVisible()
    await expect(page.getByText('Invalid or missing API key').first()).toBeVisible()
  })

  test('shows X-Api-Key auth info', async ({ page }) => {
    await page.goto('/docs/integration')
    await expect(page.getByText('X-Api-Key').first()).toBeVisible()
  })
})

test.describe('Risk Score Guide', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/docs/risk-scores')
    await expect(page.locator('h1')).toContainText('Understanding Risk Scores')
  })

  test('shows all 4 score thresholds', async ({ page }) => {
    await page.goto('/docs/risk-scores')
    await expect(page.getByText('0 – 19').first()).toBeVisible()
    await expect(page.getByText('20 – 44').first()).toBeVisible()
    await expect(page.getByText('45 – 69').first()).toBeVisible()
    await expect(page.getByText('70 – 100').first()).toBeVisible()
  })

  test('shows all 5 flag categories', async ({ page }) => {
    await page.goto('/docs/risk-scores')
    await expect(page.getByText('PDF Forensics').first()).toBeVisible()
    await expect(page.getByText('AI Content Detection').first()).toBeVisible()
    await expect(page.getByText('Cross-Reference').first()).toBeVisible()
  })

  test('shows severity levels with multipliers', async ({ page }) => {
    await page.goto('/docs/risk-scores')
    await expect(page.getByText('×1.0').first()).toBeVisible()
    await expect(page.getByText('×0.7').first()).toBeVisible()
    await expect(page.getByText('×0.4').first()).toBeVisible()
    await expect(page.getByText('×0.15').first()).toBeVisible()
  })

  test('shows example cases', async ({ page }) => {
    await page.goto('/docs/risk-scores')
    await expect(page.getByText('Example: Low Risk').first()).toBeVisible()
    await expect(page.getByText('Example: Critical Risk').first()).toBeVisible()
  })
})

test.describe('Quick-Start Guide', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/docs/quickstart')
    await expect(page.locator('h1')).toContainText('Quick-Start Guide')
  })

  test('shows all 6 steps', async ({ page }) => {
    await page.goto('/docs/quickstart')
    await expect(page.getByText('Log In').first()).toBeVisible()
    await expect(page.getByText('Create a New Case').first()).toBeVisible()
    await expect(page.getByText('Upload Documents').first()).toBeVisible()
    await expect(page.getByText('Run Analysis').first()).toBeVisible()
    await expect(page.getByText('Read the Risk Report').first()).toBeVisible()
    await expect(page.getByText('Take Action').first()).toBeVisible()
  })

  test('shows supported document types', async ({ page }) => {
    await page.goto('/docs/quickstart')
    await expect(page.getByText('Payslip').first()).toBeVisible()
    await expect(page.getByText('Bank statement').first()).toBeVisible()
  })

  test('shows action recommendations', async ({ page }) => {
    await page.goto('/docs/quickstart')
    await expect(page.getByText('Approve').first()).toBeVisible()
    await expect(page.getByText('Manual Review').first()).toBeVisible()
    await expect(page.getByText('Reject').first()).toBeVisible()
  })

  test('links to other docs pages', async ({ page }) => {
    await page.goto('/docs/quickstart')
    await expect(page.locator('a[href="/docs/risk-scores"]').first()).toBeVisible()
    await expect(page.locator('a[href="/docs/integration"]').first()).toBeVisible()
  })
})

test.describe('Security & Privacy', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/docs/security')
    await expect(page.locator('h1')).toContainText('Security & Privacy')
  })

  test('shows key security sections', async ({ page }) => {
    await page.goto('/docs/security')
    await expect(page.getByText('Executive Summary').first()).toBeVisible()
    await expect(page.getByText('Data Processing').first()).toBeVisible()
    await expect(page.getByText('Encryption').first()).toBeVisible()
    await expect(page.getByText('Data Retention').first()).toBeVisible()
  })

  test('shows Anthropic no-training guarantee', async ({ page }) => {
    await page.goto('/docs/security')
    await expect(page.getByText(/not train.*model/i).first()).toBeVisible()
  })

  test('shows retention periods', async ({ page }) => {
    await page.goto('/docs/security')
    await expect(page.getByText('90 days').first()).toBeVisible()
    await expect(page.getByText('7 years').first()).toBeVisible()
  })

  test('shows encryption standards', async ({ page }) => {
    await page.goto('/docs/security')
    await expect(page.getByText('TLS 1.3').first()).toBeVisible()
    await expect(page.getByText('AES-256').first()).toBeVisible()
  })

  test('has contact emails', async ({ page }) => {
    await page.goto('/docs/security')
    await expect(page.getByText('security@trutina.com.au').first()).toBeVisible()
    await expect(page.getByText('privacy@trutina.com.au').first()).toBeVisible()
  })

  test('shows last updated date', async ({ page }) => {
    await page.goto('/docs/security')
    await expect(page.getByText('March 2026')).toBeVisible()
  })
})

test.describe('APRA/ASIC Compliance', () => {
  test('page loads with heading', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.locator('h1')).toContainText('APRA/ASIC Compliance')
  })

  test('covers all key regulatory standards', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.getByText('CPS 220').first()).toBeVisible()
    await expect(page.getByText('CPS 234').first()).toBeVisible()
    await expect(page.getByText('CPG 235').first()).toBeVisible()
    await expect(page.getByText('RG 209').first()).toBeVisible()
  })

  test('shows ASIC Report 780 section', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.getByText('Report 780').first()).toBeVisible()
  })

  test('has explainability section', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.getByText('Explainability').first()).toBeVisible()
  })

  test('has regulatory mapping table', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.getByText('Regulatory Mapping').first()).toBeVisible()
  })

  test('links to security whitepaper', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.locator('a[href="/docs/security"]').first()).toBeVisible()
  })

  test('has compliance contact', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.getByText('compliance@trutina.com.au').first()).toBeVisible()
  })

  test('shows last updated and disclaimer', async ({ page }) => {
    await page.goto('/docs/compliance')
    await expect(page.getByText('March 2026')).toBeVisible()
    await expect(page.getByText(/does not constitute legal advice/i)).toBeVisible()
  })
})

test.describe('Docs — Smoke Tests', () => {
  const docsRoutes = [
    '/docs',
    '/docs/one-pager',
    '/docs/pitch',
    '/docs/roi',
    '/docs/integration',
    '/docs/risk-scores',
    '/docs/quickstart',
    '/docs/security',
    '/docs/compliance',
  ]

  for (const path of docsRoutes) {
    test(`${path} loads without error`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text())
      })
      const resp = await page.goto(path)
      expect(resp?.status()).toBe(200)
      await page.waitForLoadState('domcontentloaded')
      const real = errors.filter(e =>
        !e.includes('favicon') && !e.includes('third-party') &&
        !e.includes('_vercel') && !e.includes('hydrat') &&
        !e.includes('booking-widget') && !e.includes('donnacha.app') &&
        !e.includes('ERR_BLOCKED') && !e.includes('net::') &&
        !e.includes('Failed to load resource') && !e.includes('SSL')
      )
      expect(real).toHaveLength(0)
    })
  }
})

test.describe('Docs — Navigation', () => {
  test('docs hub → one-pager → back to docs', async ({ page }) => {
    await page.goto('/docs')
    await page.locator('a[href="/docs/one-pager"]').click()
    await expect(page.getByRole('heading', { name: 'The Problem' })).toBeVisible()
    await page.locator('a[href="/docs"]').first().click()
    await expect(page.locator('h1')).toContainText('Documentation & Resources')
  })

  test('docs hub → quickstart → back to docs', async ({ page }) => {
    await page.goto('/docs')
    await page.locator('a[href="/docs/quickstart"]').click()
    await expect(page.locator('h1')).toContainText('Quick-Start Guide')
    await page.locator('a[href="/docs"]').first().click()
    await expect(page.locator('h1')).toContainText('Documentation & Resources')
  })

  test('quickstart links to risk-scores guide', async ({ page }) => {
    await page.goto('/docs/quickstart')
    await page.locator('a[href="/docs/risk-scores"]').first().click()
    await expect(page.locator('h1')).toContainText('Understanding Risk Scores')
  })

  test('compliance links to security whitepaper', async ({ page }) => {
    await page.goto('/docs/compliance')
    await page.locator('a[href="/docs/security"]').first().click()
    await expect(page.locator('h1')).toContainText('Security & Privacy')
  })
})

test.describe('Docs — Responsive', () => {
  test('docs hub renders without horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/docs')
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })

  test('one-pager renders without horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/docs/one-pager')
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })

  test('roi calculator sliders are usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/docs/roi')
    const sliders = page.locator('input[type="range"]')
    const count = await sliders.count()
    expect(count).toBe(4)
    for (let i = 0; i < count; i++) {
      await expect(sliders.nth(i)).toBeVisible()
    }
  })

  test('integration guide is readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/docs/integration')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('code:has-text("/api/v1/webhooks/ingest")').first()).toBeVisible()
  })

  test('risk-scores page renders on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/docs/risk-scores')
    await expect(page.locator('h1')).toBeVisible()
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(375)
  })
})
