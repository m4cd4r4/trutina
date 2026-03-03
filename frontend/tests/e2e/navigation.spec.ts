import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('landing page nav links work', async ({ page }) => {
    await page.goto('/')

    // Features anchor
    const featuresLink = page.locator('a[href="#features"]').first()
    if (await featuresLink.isVisible()) {
      await featuresLink.click()
      await expect(page).toHaveURL(/#features/)
    }

    // Pricing anchor
    const pricingLink = page.locator('a[href="#pricing"]').first()
    if (await pricingLink.isVisible()) {
      await pricingLink.click()
      await expect(page).toHaveURL(/#pricing/)
    }
  })

  test('landing page "See it in action" links to demo', async ({ page }) => {
    await page.goto('/')
    await page.locator('a:has-text("See it in action")').first().click()
    await expect(page).toHaveURL(/\/demo/)
    await expect(page.locator('text=See Trutina in action')).toBeVisible()
  })

  test('landing page "Live Demo" nav link works', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav a:has-text("Live Demo")').click()
    await expect(page).toHaveURL(/\/demo/)
  })

  test('demo list → case detail → back to list', async ({ page }) => {
    await page.goto('/demo')
    await page.locator('a[href="/demo/demo-clean"]').click()
    await expect(page.locator('text=Priya Sharma')).toBeVisible()

    await page.locator('text=All demo cases').click()
    await expect(page).toHaveURL(/\/demo$/)
    await expect(page.locator('text=See Trutina in action')).toBeVisible()
  })

  test('demo list → all 5 case links resolve', async ({ page }) => {
    await page.goto('/demo')
    const caseIds = ['demo-clean', 'demo-ai-fake', 'demo-bad-abn', 'demo-bank-fraud', 'demo-broker-cluster']
    for (const id of caseIds) {
      const link = page.locator(`a[href="/demo/${id}"]`)
      await expect(link).toBeVisible()
    }
  })

  test('demo case detail nav shows "All cases" link', async ({ page }) => {
    await page.goto('/demo/demo-ai-fake')
    await expect(page.locator('nav a:has-text("All cases")')).toBeVisible()
  })

  test('demo case "Start free trial" CTA links to pricing', async ({ page }) => {
    await page.goto('/demo/demo-clean')
    const cta = page.locator('a:has-text("Start free trial")')
    await expect(cta).toBeVisible()
    const href = await cta.getAttribute('href')
    expect(href).toContain('pricing')
  })

  test('Trutina logo links to homepage from demo', async ({ page }) => {
    await page.goto('/demo')
    await page.locator('nav a').filter({ has: page.locator('img[alt="Trutina"]') }).first().click()
    await page.waitForURL('**/')
    const url = page.url()
    expect(url.endsWith('/') || url.endsWith('.au')).toBeTruthy()
  })

  test('"Back to site" link on demo list works', async ({ page }) => {
    await page.goto('/demo')
    await page.locator('a:has-text("Back to site")').click()
    await page.waitForURL('**/')
    const url = page.url()
    expect(url.endsWith('/') || url.endsWith('.au')).toBeTruthy()
  })
})
