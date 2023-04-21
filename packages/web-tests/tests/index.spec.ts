import { test, expect } from '@playwright/test'

test('fe should stablish connection with be', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  const apiResponse = page.getByText('"status": "ok"')

  await expect(apiResponse).toBeVisible()
})

// TODO: Add docker compose to github actions
test('should return ', async ({ page }) => {
  await page.goto('http://localhost:3000/todos')

  const title = page.getByText('"TODOs"')

  await expect(title).toBeVisible()
})
