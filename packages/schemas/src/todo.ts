import z from 'zod'

export const TodoSchema = z.object({
  _id: z.string(),
  title: z.string(),
  completed: z.boolean(),
})

export type Todo = z.infer<typeof TodoSchema>
