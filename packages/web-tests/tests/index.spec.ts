import { test, expect } from '@playwright/test'

test('fe should stablish connection with be', async ({ page, request }) => {
  console.log(await request.get(`http://127.0.0.1:4000/health`))

  await page.goto('/')

  const apiResponse = page.getByText('"status": "ok"')

  await expect(apiResponse).toBeVisible()
})

// TODO: Add docker compose to github actions
test('should return ', async ({ page }) => {
  await page.goto('/todos')

  const title = page.getByText('TODOs')

  await expect(title).toBeVisible()
})
