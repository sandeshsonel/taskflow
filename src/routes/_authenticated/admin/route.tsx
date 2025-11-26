import { AdminLayout } from '@/components/layout/admin-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminLayout,
})


