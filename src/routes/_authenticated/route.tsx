import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getProfileDetails } from '@/services/userService'
import { store } from '@/store'
import { logout, updateUserDetails } from '@/store/slices/authSlice'
import { useDispatch } from 'react-redux'
import { decodeJwt } from '@/lib/utils'

type JwtPayload = {
  exp: number
  role?: string
}

function RootComponent() {
  const { data } = useQuery({
    queryKey: ['profile-details'],
    queryFn: getProfileDetails,
    staleTime: 1000 * 60 * 1, // 1 minutes
  })
  const dispatch = useDispatch()

  useEffect(() => {
    if (data?.success && data?.data) {
      dispatch(updateUserDetails(data.data))
    }
  }, [data])

  return (
    <>
      <Outlet />
    </>
  )
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async (context) => {
    const token: string | null = store.getState().auth.token
    const userRole = store.getState().auth.user?.role

    if (!token) {
      throw redirect({ to: '/sign-in' })
    } else {
      const payload = decodeJwt(token) as JwtPayload | null

      if (!payload || payload.exp * 1000 < Date.now()) {
        store.dispatch(logout())
        localStorage.clear()
        throw redirect({ to: '/sign-in', replace: true })
      } else {
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
  component: RootComponent,
})
