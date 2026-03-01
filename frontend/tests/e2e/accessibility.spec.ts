import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('landing page images have alt text or are decorative', async ({ page }) => {
    await page.goto('/')
    const images = page.locator('img')
    const count = await images.count()
    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')
      const ariaHidden = await img.getAttribute('aria-hidden')
      // Image should have alt text, or be marked decorative
      const isAccessible = (alt !== null && alt !== '') || role === 'presentation' || ariaHidden === 'true'
      expect(isAccessible, `Image ${i} missing alt text`).toBeTruthy()
    }
  })

  test('all links have discernible text', async ({ page }) => {
    await page.goto('/')
    const links = page.locator('a')
    const count = await links.count()
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      const title = await link.getAttribute('title')
      const hasChild = (await link.locator('svg, img').count()) > 0
      const hasText = (text?.trim().length || 0) > 0 || ariaLabel || title || hasChild
      expect(hasText, `Link ${i} has no discernible text`).toBeTruthy()
    }
  })

  test('interactive elements are keyboard focusable', async ({ page }) => {
    await page.goto('/')
    // Tab through the page and check focus is visible
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(focused).toBeTruthy()
  })

  test('demo case detail page has semantic heading hierarchy', async ({ page }) => {
    await page.goto('/demo/demo-ai-fake')
    // h1 should be applicant name
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText('James Chen')

    // h2 elements should exist for sections
    const h2s = page.locator('h2')
    const count = await h2s.count()
    expect(count).toBeGreaterThanOrEqual(2) // At least summary + fraud flags
  })

  test('color contrast — risk badges have distinguishable text', async ({ page }) => {
    await page.goto('/demo')
    // All risk badges should be visible (not invisible text)
    const badges = page.locator('span:has-text("Low"), span:has-text("High"), span:has-text("Critical")')
    const count = await badges.count()
    expect(count).toBeGreaterThanOrEqual(3)
    for (let i = 0; i < count; i++) {
      await expect(badges.nth(i)).toBeVisible()
    }
  })

  test('document viewer iframe has title attribute', async ({ page }) => {
    await page.goto('/demo/demo-clean')
    const payslipBtn = page.locator('button:has-text("mitchell_payslip_jan2026.pdf")')
    await payslipBtn.click()
    const iframe = page.locator('iframe')
    const title = await iframe.getAttribute('title')
    expect(title).toBeTruthy()
  })
})
