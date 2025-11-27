import { z } from 'zod'

const _userRole = z.union([
  z.literal('admin'),
  z.literal('editor'),
  z.literal('viewer'),
])

const _userStatus = z.union([
  z.literal('active'),
  z.literal('suspended'),
  z.literal('invited'),
])

export type UserStatus = z.infer<typeof _userStatus>

export type UserRole = z.infer<typeof _userRole>

const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: _userRole,
  status: _userStatus,
  lastLogin: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
