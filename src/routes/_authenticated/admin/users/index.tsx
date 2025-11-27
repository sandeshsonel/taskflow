import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/admin/users'

const usersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  role: z
    .array(
      z.union([z.literal('admin'), z.literal('editor'), z.literal('viewer')])
    )
    .optional()
    .catch([]),
  // Per-column text filter (example for username)
  username: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/admin/users/')({
  validateSearch: usersSearchSchema,
  component: Users,
})
