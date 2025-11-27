import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/admin/dashboard'

export const Route = createFileRoute('/_authenticated/admin/dashboard/')({
  component: Dashboard,
})
