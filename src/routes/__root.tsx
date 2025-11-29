import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import BugReport from '@/components/bug-report'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'

const bugReportPath = ['/sign-in', '/sign-up']

function RootComponent() {
  const { pathname } = useLocation()
  return (
    <div className='relative'>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={5000} />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}

      {bugReportPath.includes(pathname) && (
        <div className='absolute right-6 bottom-6'>
          <BugReport />
        </div>
      )}
    </div>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
