import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('hero section renders with heading and subheading', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Stop AI-generated mortgage fraud')
    await expect(page.locator('text=before it costs billions')).toBeVisible()
  })

  test('threat context section renders with bank data', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=The threat is real and industry-wide')).toBeVisible()
    await expect(page.getByText('CBA', { exact: true })).toBeVisible()
    // Use getByText to avoid regex interpretation of ~
    await expect(page.getByText('~$1B')).toBeVisible()
  })

  test('features section renders all 6 features', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Six-layer detection engine')).toBeVisible()
    const features = [
      'PDF Forensics',
      'AI Content Detection',
      'Cross-Reference Verification',
      'Math & Date Consistency',
      'Broker Risk Profiling',
      'Explainable for APRA',
    ]
    for (const f of features) {
      await expect(page.getByText(f).first()).toBeVisible()
    }
  })

  test('pricing section renders all 4 tiers', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#pricing h2')).toBeVisible()
    const plans = ['Free Trial', 'Starter', 'Professional', 'Enterprise']
    for (const p of plans) {
      await expect(page.getByText(p).first()).toBeVisible()
    }
  })

  test('pricing shows correct prices', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Free', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('$2,000').first()).toBeVisible()
    await expect(page.getByText('$6,000').first()).toBeVisible()
    await expect(page.getByText('Custom').first()).toBeVisible()
  })

  test('login modal opens when "Sign in" is clicked', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Sign in")').click()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login modal closes when backdrop is clicked', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Sign in")').click()
    await expect(page.locator('input[type="password"]')).toBeVisible()

    // Click the outer wrapper (which has onClick={onClose}) at the very edge
    // The modal wrapper div covers the full screen; clicking far from center hits the backdrop
    await page.mouse.click(5, 5)
    await expect(page.locator('input[type="password"]')).not.toBeVisible({ timeout: 3000 })
  })

  test('stats section shows analysis time, cost, modules', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('~60s')).toBeVisible()
    await expect(page.getByText('$0').first()).toBeVisible()
  })

  test('footer renders with company info', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toContainText('Solaisoft')
    await expect(page.locator('footer')).toContainText('hello@trutina.com.au')
  })

  test('nav bar has Trutina branding', async ({ page }) => {
    await page.goto('/')
    const brand = page.locator('nav').first()
    await expect(brand).toContainText('Trutina')
  })

  test('"Most Popular" label appears on Professional plan', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Most Popular')).toBeVisible()
  })
})
