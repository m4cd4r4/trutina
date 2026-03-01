import { test, expect } from '@playwright/test'

test.describe('Demo Features', () => {
  test.describe('Case List Page', () => {
    test('renders all 5 demo cases', async ({ page }) => {
      await page.goto('/demo')
      const caseCards = page.locator('[data-tour^="case-card-"]')
      await expect(caseCards).toHaveCount(5)
    })

    test('each case shows score gauge', async ({ page }) => {
      await page.goto('/demo')
      const gauges = page.locator('[data-tour^="case-card-"] svg')
      const count = await gauges.count()
      expect(count).toBeGreaterThanOrEqual(5)
    })

    test('each case shows risk badge', async ({ page }) => {
      await page.goto('/demo')
      const badges = page.locator('[data-tour^="case-card-"]')
      for (let i = 0; i < 5; i++) {
        const card = badges.nth(i)
        const text = await card.textContent()
        const hasRisk = /low|medium|high|critical/i.test(text || '')
        expect(hasRisk).toBeTruthy()
      }
    })

    test('flag summary chips render correctly', async ({ page }) => {
      await page.goto('/demo')
      const aiFakeCard = page.locator('a[href="/demo/demo-ai-fake"]')
      await expect(aiFakeCard.locator('text=3 critical')).toBeVisible()
    })

    test('CTA section renders at bottom', async ({ page }) => {
      await page.goto('/demo')
      await expect(page.locator('text=Ready to try with your own documents?')).toBeVisible()
    })
  })

  test.describe('Case Detail Page', () => {
    test('score gauge renders with correct risk color', async ({ page }) => {
      await page.goto('/demo/demo-ai-fake')
      const gauge = page.locator('[data-tour="score-gauge"]')
      await expect(gauge).toBeVisible()
      await expect(page.locator('text=82')).toBeVisible()
    })

    test('recommended action banner renders', async ({ page }) => {
      await page.goto('/demo/demo-ai-fake')
      await expect(page.locator('[data-tour="recommended-action"]')).toBeVisible()
      await expect(page.locator('text=Recommended: Reject')).toBeVisible()
    })

    test('approve action renders for clean case', async ({ page }) => {
      await page.goto('/demo/demo-clean')
      await expect(page.locator('text=Recommended: Approve')).toBeVisible()
    })

    test('manual review action renders for bad ABN case', async ({ page }) => {
      await page.goto('/demo/demo-bad-abn')
      await expect(page.locator('text=Recommended: Manual Review')).toBeVisible()
    })

    test('analysis summary renders', async ({ page }) => {
      await page.goto('/demo/demo-ai-fake')
      const summary = page.locator('[data-tour="analysis-summary"]')
      await expect(summary).toBeVisible()
      await expect(summary.locator('text=High-confidence AI-generated')).toBeVisible()
    })

    test('fraud flags section renders with correct count', async ({ page }) => {
      await page.goto('/demo/demo-ai-fake')
      await expect(page.locator('text=Fraud Flags (6)')).toBeVisible()
    })

    test('fraud flag evidence panels render', async ({ page }) => {
      await page.goto('/demo/demo-ai-fake')
      const evidencePanels = page.locator('text=Evidence').first()
      await expect(evidencePanels).toBeVisible()
    })

    test('case stats grid shows loan amount, docs, flags, broker', async ({ page }) => {
      await page.goto('/demo/demo-bank-fraud')
      await expect(page.locator('text=Loan Amount')).toBeVisible()
      await expect(page.locator('text=$750,000')).toBeVisible()
      // Use getByText with exact match to avoid hitting "Source Documents"
      await expect(page.getByText('Documents', { exact: true }).first()).toBeVisible()
      await expect(page.getByText('Premier Lending Solutions').first()).toBeVisible()
    })
  })

  test.describe('Document Viewer', () => {
    test('document viewer section renders', async ({ page }) => {
      await page.goto('/demo/demo-clean')
      await expect(page.locator('text=Source Documents')).toBeVisible()
    })

    test('document tabs are clickable', async ({ page }) => {
      await page.goto('/demo/demo-clean')
      const payslipBtn = page.locator('button:has-text("sharma_payslip_jan2026.pdf")')
      await expect(payslipBtn).toBeVisible()
      await payslipBtn.click()
      const iframe = page.locator('iframe[src*="sharma_payslip"]')
      await expect(iframe).toBeVisible()
    })

    test('document viewer shows flag overlay for document', async ({ page }) => {
      await page.goto('/demo/demo-clean')
      const payslipBtn = page.locator('button:has-text("sharma_payslip_jan2026.pdf")')
      await payslipBtn.click()
      await expect(page.locator('text=Flags detected in this document')).toBeVisible()
    })

    test('clicking same document again hides viewer', async ({ page }) => {
      await page.goto('/demo/demo-clean')
      const payslipBtn = page.locator('button:has-text("sharma_payslip_jan2026.pdf")')
      await payslipBtn.click()
      await expect(page.locator('iframe')).toBeVisible()
      await payslipBtn.click()
      await expect(page.locator('iframe')).not.toBeVisible()
    })

    test('"Open in new tab" link is present', async ({ page }) => {
      await page.goto('/demo/demo-clean')
      const payslipBtn = page.locator('button:has-text("sharma_payslip_jan2026.pdf")')
      await payslipBtn.click()
      await expect(page.locator('text=Open in new tab')).toBeVisible()
    })

    test('PDF files are accessible via direct URL', async ({ request }) => {
      const resp = await request.get('/demo-docs/sharma_payslip_jan2026.pdf')
      expect(resp.status()).toBe(200)
    })

    test('all 8 demo PDFs are accessible', async ({ request }) => {
      const pdfs = [
        'sharma_payslip_jan2026.pdf',
        'sharma_nab_dec2025.pdf',
        'kowalski_payslip_jan2026.pdf',
        'thompson_payslip_jan2026.pdf',
        'thompson_employment_letter.pdf',
        'chen_payslip_jan2026.pdf',
        'chen_cba_dec2025.pdf',
        'mitchell_payslip_jan2026.pdf',
      ]
      for (const pdf of pdfs) {
        const resp = await request.get(`/demo-docs/${pdf}`)
        expect(resp.status(), `${pdf} should return 200`).toBe(200)
      }
    })

    test('bank fraud case shows both documents', async ({ page }) => {
      await page.goto('/demo/demo-bank-fraud')
      await expect(page.locator('button:has-text("chen_payslip_jan2026.pdf")')).toBeVisible()
      await expect(page.locator('button:has-text("chen_cba_dec2025.pdf")')).toBeVisible()
    })

    test('bad ABN case shows employment letter document', async ({ page }) => {
      await page.goto('/demo/demo-bad-abn')
      await expect(page.locator('button:has-text("thompson_employment_letter.pdf")')).toBeVisible()
    })
  })

  test.describe('Guided Tour', () => {
    test('tour button renders on demo list page', async ({ page }) => {
      await page.goto('/demo')
      await expect(page.locator('text=Start Guided Tour')).toBeVisible()
    })

    test('tour button renders on case detail page', async ({ page }) => {
      await page.goto('/demo/demo-ai-fake')
      await expect(page.locator('text=Start Guided Tour')).toBeVisible()
    })

    test('clicking tour button opens driver.js overlay', async ({ page }) => {
      await page.goto('/demo')
      await page.locator('text=Start Guided Tour').click()
      await expect(page.locator('.driver-popover')).toBeVisible()
    })

    test('tour can be navigated with Next button', async ({ page }) => {
      await page.goto('/demo')
      await page.locator('text=Start Guided Tour').click()
      await expect(page.locator('.driver-popover')).toBeVisible()
      await page.locator('.driver-popover-next-btn').click()
      await expect(page.locator('.driver-popover')).toBeVisible()
    })

    test('tour can be dismissed', async ({ page }) => {
      await page.goto('/demo')
      await page.locator('text=Start Guided Tour').click()
      await expect(page.locator('.driver-popover')).toBeVisible()
      await page.locator('.driver-popover-close-btn').click()
      await expect(page.locator('.driver-popover')).not.toBeVisible()
    })
  })
})
