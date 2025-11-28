import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173')
})

test('app loads and shows header', async ({ page }) => {
  await expect(page.locator('text=AOI Creator')).toBeVisible()
})

test('toggle WMS layer button works', async ({ page }) => {
  const btn = page.locator('#toggle-wms')
  await expect(btn).toBeVisible()
  const initial = await btn.textContent()
  await btn.click()
  const after = await btn.textContent()
  expect(after).not.toBe(initial)
})

test('persisted AOIs survive reload (via test helper)', async ({ page }) => {
  // Use the test helper exposed on window to persist an AOI quickly
  await page.evaluate(() => {
    ;(window as any).clearAois && (window as any).clearAois()
  })

  const sample = { type: 'Feature', geometry: { type: 'Point', coordinates: [10.0, 51.0] }, properties: {} }
  await page.evaluate((g) => {
    ;(window as any).persistAoi && (window as any).persistAoi(g)
  }, sample)

  // Reload and verify sidebar count updates
  await page.reload()
  await expect(page.locator('[data-testid="aoi-count"]')).toHaveText('1')
})
