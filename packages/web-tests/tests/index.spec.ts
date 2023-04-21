import { expect, test } from '@playwright/test'
import todos from './data/todos.json'
import users from './data/users.json'

test('fe should stablish connection with be', async ({ page, request }) => {
  console.log(await (await request.get(`http://127.0.0.1:4000/health`)).json())

  await page.goto('/')

  const apiResponse1 = page.getByText('status')
  const apiResponse2 = page.getByText('ok')

  await expect(apiResponse1).toBeVisible()
  await expect(apiResponse2).toBeVisible()
})

test('should display todos table', async ({ page }) => {
  await page.goto('/todos')

  await Promise.all(todos.map((todo) => expect(page.getByText(todo.title).first()).toBeVisible()))
})

test('should display users table', async ({ page }) => {
  await page.goto('/users')

  await Promise.all(users.map((user) => expect(page.getByText(user.name).first()).toBeVisible()))
})
