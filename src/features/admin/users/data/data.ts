import { type UserStatus, type UserRole } from './schema'

export const callTypes = new Map<UserRole, string>([
  [
    'admin',
    'bg-purple-200/40 text-purple-900 dark:text-purple-200 border-purple-300',
  ],
  [
    'editor',
    'bg-amber-200/40 text-amber-900 dark:text-amber-200 border-amber-300',
  ],
  [
    'viewer',
    'bg-emerald-200/40 text-emerald-900 dark:text-emerald-200 border-emerald-300',
  ],
])

export const statusTypes = new Map<UserStatus, string>([
  [
    'invited',
    'bg-blue-200/40 text-blue-900 dark:text-blue-200 border-blue-300',
  ],
  [
    'active',
    'bg-green-200/40 text-green-900 dark:text-green-200 border-green-300',
  ],
  ['suspended', 'bg-red-200/40 text-red-900 dark:text-red-200 border-red-300'],
])
