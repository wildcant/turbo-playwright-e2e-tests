import { test, expect } from '@playwright/test'

test.skip('fe should stablish connection with be', async ({ page, request }) => {
  console.log(await (await request.get(`http://127.0.0.1:4000/health`)).json())

  await page.goto('/')

  const apiResponse1 = page.getByText('status')
  const apiResponse2 = page.getByText('ok')

  await expect(apiResponse1).toBeVisible()
  await expect(apiResponse2).toBeVisible()
})

// TODO: Add docker compose to github actions
test.only('should return ', async ({ page }) => {
  await page.goto('/todos')

  const title = page.getByText('TODOs')

  await expect(title).toBeVisible()
})
