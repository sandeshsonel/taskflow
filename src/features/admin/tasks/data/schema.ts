import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.string(),
  priority: z.string(),
  assignTo: z.string(),
  assignBy: z
    .object({
      fullName: z.string(),
      _id: z.string(),
    })
    .optional(),
  createdAt: z.string(),
})

export type Task = z.infer<typeof taskSchema>
