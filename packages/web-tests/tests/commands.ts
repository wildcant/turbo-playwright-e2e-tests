import { chromium } from '@playwright/test'
import { OptionalId, OptionalObjectId, Todo, User } from 'schemas'
import { z } from 'zod'

const entity = z.enum(['users', 'todos'])
type Entity = z.infer<typeof entity>

export const database = {
  fetch: async (ent: Entity) => {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    return context.request.get(`${process.env.API_URL}/database/${ent}`).then((r) => r.json())
  },
  reset: async () => {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    return context.request.delete(`${process.env.API_URL}/databases/reset`).then((r) => r.json())
  },
  insert: {
    [entity.Values.users]: async (data: OptionalId<User>[]) => {
      const browser = await chromium.launch()
      const context = await browser.newContext()
      return context.request
        .post(`${process.env.API_URL}/database/${entity.Values.users}`, { data })
        .then((r) => r.json())
    },
    [entity.Values.todos]: async (data: OptionalObjectId<Todo>[]) => {
      const browser = await chromium.launch()
      const context = await browser.newContext()
      return context.request
        .post(`${process.env.API_URL}/database/${entity.Values.todos}`, { data })
        .then((r) => r.json())
    },
  },
}
