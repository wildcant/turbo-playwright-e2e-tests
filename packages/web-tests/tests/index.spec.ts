import { test, expect } from '@playwright/test'

test('homepage has a button on it', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  const button = page.getByRole('button', { name: /Boop/ })
  const apiResponse = page.getByText('Hello there')

  await expect(button).toBeVisible()
  await expect(apiResponse).toBeVisible()
})
