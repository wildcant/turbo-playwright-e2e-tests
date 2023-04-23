import z from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
})

export type User = z.infer<typeof UserSchema>
