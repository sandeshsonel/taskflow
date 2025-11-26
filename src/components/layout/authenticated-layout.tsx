import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { type RootState } from '@/store'
import { logout } from '@/store/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from '@/lib/cookies'
import { cn, decodeJwt } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const token = useSelector((state: RootState) => state.auth.token)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate({ to: '/sign-in', replace: true })
    } else {
      const payload = decodeJwt(token)

      // Validate expiration
      if (!payload || payload.exp * 1000 < Date.now()) {
        dispatch(logout())
        navigate({ to: '/sign-in', replace: true })
      } else {
        setIsValid(true)
      }
    }
  }, [navigate, token, dispatch])

  if (!isValid) {
    return null
  }

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset
            className={cn(
              '@container/content',
              'has-data-[layout=fixed]:h-svh',
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
