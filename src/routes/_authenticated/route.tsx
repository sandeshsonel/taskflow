import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getProfileDetails } from '@/services/userService'
import { type RootState, store } from '@/store'
import { logout, setUserDetails } from '@/store/slices/authSlice'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { decodeJwt } from '@/lib/utils'

type JwtPayload = {
  exp: number
  role?: string
}

function RootComponent() {
  const { data } = useQuery({
    queryKey: ['profile-details'],
    queryFn: getProfileDetails,
    staleTime: 0,
  })
  const dispatch = useDispatch()
  const userDetails = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    if (data?.success && data?.data) {
      const isUpdate = !_.isEqual(data.data, userDetails)
      if (isUpdate) {
        dispatch(setUserDetails(data.data))
      }
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

    if (!token) {
      throw redirect({ to: '/sign-in' })
    } else {
      const payload = decodeJwt(token) as JwtPayload | null

      if (!payload || payload.exp * 1000 < Date.now()) {
        store.dispatch(logout())
        localStorage.clear()
        throw redirect({ to: '/sign-in', replace: true })
      } else {
        if (payload.role === 'admin') {
          const redirectHomePath = ['/', '/admin']
          if (redirectHomePath.includes(context.location.pathname)) {
            // allow access to admin routes
            throw redirect({ to: '/admin/dashboard', replace: true })
          }
        } else {
          const isAdminPath = context.location.pathname.includes('admin')
          if (isAdminPath) {
            throw redirect({ to: '/' })
          }
        }
      }
    }

    return context
  },
  component: RootComponent,
})
