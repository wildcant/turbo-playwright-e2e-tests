import { expect, test } from '@playwright/test'
import range from 'lodash/range'
import { database } from './commands'
import { createMock } from './mocks'

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async () => {
  await database.reset()
})

test('fe should stablish connection with be', async ({ page, request }) => {
  console.log(await (await request.get(`${process.env.API_URL}/health`)).json())
  await page.goto('/')

  const apiResponse1 = page.getByText('status')
  const apiResponse2 = page.getByText('ok')

  await expect(apiResponse1).toBeVisible()
  await expect(apiResponse2).toBeVisible()
})

test('should display todos table', async ({ page }) => {
  const todos = range(10).map((_) => createMock.todo({ exclude: ['_id'] }))
  await database.insert.todos(todos)

  await page.goto('/todos')

  await Promise.all(todos.map((todo) => expect(page.getByText(todo.title).first()).toBeVisible()))
})

test.only('should display users table', async ({ page }) => {
  const users = range(10).map((_) => createMock.user({ exclude: ['id'] }))
  await database.insert.users(users)

  await page.goto('/users')
  await Promise.all(users.map((user) => expect(page.getByText(user.name).first()).toBeVisible()))
})
