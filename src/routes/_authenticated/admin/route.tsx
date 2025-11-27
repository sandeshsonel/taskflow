import { AdminLayout } from '@/components/layout/admin-layout'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: (context) => {
    // You can add authentication checks or data fetching here
    if(context.location.pathname === '/admin') {
      throw redirect({to: "/admin/dashboard", replace: true})
    }

    return context
  },
  component: AdminLayout,
})


