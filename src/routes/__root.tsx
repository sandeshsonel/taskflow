import { useQuery, type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { getProfileDetails } from '@/services/userService'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateUserDetails } from '@/store/slices/authSlice'

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
      <NavigationProgress />
      <Outlet />
      <Toaster duration={5000} />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
