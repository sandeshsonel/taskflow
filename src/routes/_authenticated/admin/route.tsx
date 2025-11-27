import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@/components/layout/admin-layout'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: (context) => {
    // You can add authentication checks or data fetching here
    if (context.location.pathname === '/admin') {
      throw redirect({ to: '/admin/dashboard', replace: true })
    }

    return context
  },
  component: AdminLayout,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
