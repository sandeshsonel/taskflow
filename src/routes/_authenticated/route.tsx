import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { store } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { decodeJwt } from '@/lib/utils'

type JwtPayload = {
  exp: number
  role?: string
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async (context) => {
    // You can add authentication checks or data fetching here
    const token: string | null = store.getState().auth.token

    return context

    if (!token) {
      throw redirect({ to: '/sign-in' })
    } else {
      const payload = decodeJwt(token) as JwtPayload | null
      if (!payload || payload.exp * 1000 < Date.now()) {
        store.dispatch(logout())
        throw redirect({ to: '/sign-in', replace: true })
      } else {
        const userRole = payload.role
        if (userRole === 'admin') {
          const redirectHomePath = ['/', '/admin']
          if (redirectHomePath.includes(context.location.pathname)) {
            // allow access to admin routes
            throw redirect({ to: '/admin/dashboard', replace: true })
          } else {
            // allow access to other admin routes
          }
        }
      }
    }

    return context
  },
  component: Outlet,
})
