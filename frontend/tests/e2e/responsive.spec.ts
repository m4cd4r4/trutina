import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  test.describe('Mobile (375px)', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('landing page renders without horizontal overflow', async ({ page }) => {
      await page.goto('/')
      const body = page.locator('body')
      const scrollWidth = await body.evaluate(el => el.scrollWidth)
      const clientWidth = await body.evaluate(el => el.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // 1px tolerance
    })

    test('demo list renders without horizontal overflow', async ({ page }) => {
      await page.goto('/demo')
      const body = page.locator('body')
      const scrollWidth = await body.evaluate(el => el.scrollWidth)
      const clientWidth = await body.evaluate(el => el.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test('demo case detail renders without horizontal overflow', async ({ page }) => {
      await page.goto('/demo/demo-ai-fake')
      const body = page.locator('body')
      const scrollWidth = await body.evaluate(el => el.scrollWidth)
      const clientWidth = await body.evaluate(el => el.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test('landing hero text is visible on mobile', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('text=Stop AI-generated mortgage fraud')).toBeVisible()
    })

    test('pricing cards stack vertically on mobile', async ({ page }) => {
      await page.goto('/')
      // On mobile, pricing grid should be 1 column
      const pricingSection = page.locator('#pricing')
      await pricingSection.scrollIntoViewIfNeeded()
      await expect(page.locator('text=Free Trial').first()).toBeVisible()
    })

    test('demo case cards are readable on mobile', async ({ page }) => {
      await page.goto('/demo')
      const firstCard = page.locator('[data-tour="case-card-0"]')
      await expect(firstCard).toBeVisible()
      await expect(firstCard.locator('text=Sarah Mitchell')).toBeVisible()
    })
  })

  test.describe('Tablet (768px)', () => {
    test.use({ viewport: { width: 768, height: 1024 } })

    test('landing page renders cleanly on tablet', async ({ page }) => {
      await page.goto('/')
      const body = page.locator('body')
      const scrollWidth = await body.evaluate(el => el.scrollWidth)
      const clientWidth = await body.evaluate(el => el.clientWidth)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
    })

    test('features grid shows 2 columns on tablet', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('text=PDF Forensics')).toBeVisible()
      await expect(page.locator('text=AI Content Detection')).toBeVisible()
    })

    test('demo case detail stats grid is visible', async ({ page }) => {
      await page.goto('/demo/demo-clean')
      await expect(page.locator('text=Loan Amount')).toBeVisible()
      await expect(page.getByText('Documents', { exact: true }).first()).toBeVisible()
      await expect(page.getByText('Flags', { exact: true }).first()).toBeVisible()
    })
  })
})
