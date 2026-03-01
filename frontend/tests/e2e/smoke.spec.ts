import { test, expect } from '@playwright/test'

test.describe('Smoke Tests — all routes load', () => {
  test('landing page loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Trutina/i)
    await expect(page.locator('text=Stop AI-generated mortgage fraud')).toBeVisible()
  })

  test('landing page has no console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Filter out known benign errors (e.g. favicon, third-party)
    const real = errors.filter(e => !e.includes('favicon') && !e.includes('third-party'))
    expect(real).toHaveLength(0)
  })

  test('demo list page loads', async ({ page }) => {
    await page.goto('/demo')
    await expect(page.locator('text=See Trutina in action')).toBeVisible()
  })

  test('demo case detail page loads (clean case)', async ({ page }) => {
    await page.goto('/demo/demo-clean')
    await expect(page.locator('text=Sarah Mitchell')).toBeVisible()
  })

  test('demo case detail page loads (AI fake case)', async ({ page }) => {
    await page.goto('/demo/demo-ai-fake')
    await expect(page.locator('text=James Chen')).toBeVisible()
  })

  test('demo case detail page loads (bad ABN case)', async ({ page }) => {
    await page.goto('/demo/demo-bad-abn')
    await expect(page.locator('text=Emma Thompson')).toBeVisible()
  })

  test('demo case detail page loads (bank fraud case)', async ({ page }) => {
    await page.goto('/demo/demo-bank-fraud')
    await expect(page.locator('text=David Kowalski')).toBeVisible()
  })

  test('demo case detail page loads (broker cluster case)', async ({ page }) => {
    await page.goto('/demo/demo-broker-cluster')
    await expect(page.getByRole('heading', { name: 'Priya Sharma' })).toBeVisible()
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Sign in').first()).toBeVisible()
  })

  test('invalid demo case returns 404', async ({ page }) => {
    const resp = await page.goto('/demo/nonexistent-case')
    expect(resp?.status()).toBe(404)
  })
})
